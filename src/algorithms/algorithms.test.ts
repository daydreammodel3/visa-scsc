import { describe, expect, it } from 'vitest';
import { algorithms } from '.';
import { LANGS, parseCode, pointsIn } from '../lib/code';
import { traceBubble } from './bubble';
import { traceSelection } from './selection';
import { traceInsertion } from './insertion';
import { traceLinear } from './linear';
import { traceBinary } from './binary';
import { traceMerge } from './merge';
import { traceQuick } from './quick';
import { traceFactorial } from './recursion';
import { traceStack } from './stack';
import { traceQueue } from './queue';
import { traceLinkedList } from './linkedlist';
import { Recorder } from './recorder';
import type { Step } from './types';

const values = (s: Step) => s.items.map((it) => it?.value);

function randomArray(rand: () => number, n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(rand() * 20));
}

/** 再現できる乱数 */
function lcg(seed: number) {
  let x = seed;
  return () => {
    x = (x * 1103515245 + 12345) % 2 ** 31;
    return x / 2 ** 31;
  };
}

describe.each(algorithms)('$name', (algo) => {
  const steps = algo.trace();

  it('ID が重複していない', () => {
    expect(algorithms.filter((a) => a.id === algo.id)).toHaveLength(1);
  });

  it('ステップがあり、どれも説明文を持つ', () => {
    expect(steps.length).toBeGreaterThan(2);
    for (const s of steps) {
      expect(s.text((i) => i).length).toBeGreaterThan(0);
      expect(s.text((i) => i + 1).length).toBeGreaterThan(0);
      if (algo.inputIsArray) expect(s.items).toHaveLength(algo.input.length);
    }
  });

  it.each(LANGS.map((l) => l.id))('%s のコードに、使っている目印がすべてある', (lang) => {
    const pts = pointsIn(algo.code[lang]);
    const used = new Set(steps.map((s) => s.point).filter((p): p is string => p !== null));
    for (const p of used) expect(pts, `${lang} に ⟦${p}⟧ がない`).toContain(p);
    // どの言語も擬似言語と同じ目印を持つ（見つからなかった場合など、サンプルでは通らない行も含めて）
    expect([...pts].sort()).toEqual([...pointsIn(algo.code.pseudo)].sort());
  });

  it.runIf(algo.inputIsArray).each(LANGS.filter((l) => l.id !== 'pseudo').map((l) => l.id))('%s のサンプル入力が input と同じ', (lang) => {
    const src = parseCode(algo.code[lang])
      .map((l) => l.text)
      .join('\n');
    const nums = algo.input.join(',\\s*');
    expect(src).toMatch(new RegExp(nums));
  });

  it('擬似言語が IPA の書き方（○で始まり、endif などで閉じる）', () => {
    const src = algo.code.pseudo;
    expect(src).toMatch(/^○/m);
    expect(src).not.toMatch(/[{;]\s*$/m);
    for (const [open, close] of [
      ['if (', 'endif'],
      ['for (', 'endfor'],
      ['while (', 'endwhile'],
    ]) {
      const count = (s: string) => src.split('\n').filter((l) => l.trim().startsWith(s)).length;
      expect(count(open)).toBe(count(close));
    }
  });
});

describe('整列のデータ', () => {
  it('すべての整列が同じ入力を使う（ステップ数を比べられるように）', () => {
    const sorts = algorithms.filter((a) => a.category === '整列');
    expect(sorts.length).toBeGreaterThanOrEqual(5);
    for (const a of sorts) expect(a.input, a.id).toEqual(sorts[0].input);
  });
});

describe('整列の結果', () => {
  const rand = lcg(42);
  const cases = [[], [1], [2, 1], [3, 3, 1], [5, 4, 3, 2, 1], [1, 2, 3, 4, 5], ...Array.from({ length: 30 }, () => randomArray(rand, 1 + Math.floor(rand() * 9)))];
  it.each([
    ['bubble', traceBubble],
    ['selection', traceSelection],
    ['insertion', traceInsertion],
    ['merge', traceMerge],
    ['quick', traceQuick],
  ] as const)('%s は昇順に並べる', (_name, trace) => {
    for (const input of cases) {
      if (input.length < 1) continue;
      const steps = trace(input);
      const last = steps[steps.length - 1];
      expect(values(last)).toEqual([...input].sort((a, b) => a - b));
      expect(last.held ?? null).toBeNull();
      // 途中で要素が消えたり増えたりしない
      for (const s of steps) {
        const vs = [...s.items, ...(s.aux ?? []), s.held?.item ?? null].filter((x) => x !== null).map((x) => x!.value);
        expect(vs.sort((a, b) => a - b)).toEqual([...input].sort((a, b) => a - b));
      }
    }
  });
});

describe('探索の結果', () => {
  const sorted = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
  const foundAt = (steps: Step[]) => {
    const last = steps[steps.length - 1];
    const i = Object.entries(last.marks).find(([, m]) => m === 'found')?.[0];
    return i === undefined ? -1 : Number(i);
  };
  it('線形探索', () => {
    const data = [7, 3, 9, 4, 6, 2];
    for (const t of [...data, 100]) expect(foundAt(traceLinear(data, t))).toBe(data.indexOf(t));
  });
  it('二分探索', () => {
    for (const t of [...sorted, 0, 10, 100]) expect(foundAt(traceBinary(sorted, t))).toBe(sorted.indexOf(t));
  });
  it('サンプルの期待出力と一致', () => {
    for (const a of algorithms.filter((x) => x.inputIsArray)) {
      const steps = a.trace();
      const out = a.target === undefined ? values(steps[steps.length - 1]).join(' ') : String(foundAt(steps));
      expect(out, a.id).toBe(a.expectedOutput);
    }
  });
});

describe('parseCode', () => {
  it('コメント記号ごと目印を取りのぞく', () => {
    expect(parseCode('x = 1  # ⟦a⟧\ny = 2 // ⟦b,c⟧\nz ← 3  ⟦d⟧\nw = 4 # memo ⟦e⟧')).toEqual([
      { text: 'x = 1', points: ['a'] },
      { text: 'y = 2', points: ['b', 'c'] },
      { text: 'z ← 3', points: ['d'] },
      { text: 'w = 4 # memo', points: ['e'] },
    ]);
  });
});

describe('再帰・データ構造の結果', () => {
  const lastVar = (steps: Step[], name: string) => steps[steps.length - 1].vars.find((v) => v.name === name)?.value;
  it('階乗', () => {
    for (const n of [1, 2, 3, 5, 6]) {
      const steps = traceFactorial(n);
      expect(lastVar(steps, '結果')).toBe([1, 1, 2, 6, 24, 120, 720][n]);
      expect(steps[steps.length - 1].frames).toEqual([]);
      expect(Math.max(...steps.map((s) => s.frames!.length))).toBe(n);
    }
  });
  it('スタックは後入れ先出し、いっぱい・空のときは何もしない', () => {
    const steps = traceStack(2, [
      { op: 'pop' },
      { op: 'push', value: 1 },
      { op: 'push', value: 2 },
      { op: 'push', value: 3 },
      { op: 'pop' },
      { op: 'pop' },
      { op: 'pop' },
    ]);
    expect(lastVar(steps, '取り出した順')).toBe('2 1');
  });
  it('キューは先入れ先出し、端で折り返す', () => {
    const steps = traceQueue(2, [
      { op: 'enqueue', value: 1 },
      { op: 'enqueue', value: 2 },
      { op: 'enqueue', value: 3 },
      { op: 'dequeue' },
      { op: 'enqueue', value: 4 },
      { op: 'dequeue' },
      { op: 'dequeue' },
      { op: 'dequeue' },
    ]);
    expect(lastVar(steps, '取り出した順')).toBe('1 2 4');
  });
  it('線形リスト：先頭・途中・末尾・ない値の削除', () => {
    const run = (rm: number) =>
      lastVar(
        traceLinkedList([
          { op: 'append', value: 1 },
          { op: 'append', value: 2 },
          { op: 'append', value: 3 },
          { op: 'remove', value: rm },
        ]),
        'リストの中身',
      );
    expect(run(1)).toBe('2 → 3');
    expect(run(2)).toBe('1 → 3');
    expect(run(3)).toBe('1 → 2');
    expect(run(9)).toBe('1 → 2 → 3');
  });
  it('サンプルの期待出力と一致', () => {
    expect(lastVar(traceFactorial(4), '結果')).toBe(24);
    for (const id of ['stack', 'queue'] as const) {
      const a = algorithms.find((x) => x.id === id)!;
      expect(lastVar(a.trace(), '取り出した順')).toBe(a.expectedOutput);
    }
    const ll = algorithms.find((x) => x.id === 'linkedlist')!;
    expect(String(lastVar(ll.trace(), 'リストの中身')).split(' → ').join(' ')).toBe(ll.expectedOutput);
  });
});

describe('説明文', () => {
  // 説明文は表示するときに呼ばれる関数なので、あとで変わる状態を参照していると、別のステップの内容が出てしまう
  it.each(algorithms.map((a) => [a.id, a] as const))('%s：記録したときと、あとで表示したときで同じ', (_id, algo) => {
    const original = Recorder.prototype.push;
    const atPush: string[][] = [];
    Recorder.prototype.push = function (this: Recorder, s) {
      atPush.push([s.text((i) => i), s.text((i) => i + 1)]);
      original.call(this, s);
    };
    try {
      const steps = algo.trace();
      expect(steps.map((s) => [s.text((i) => i), s.text((i) => i + 1)])).toEqual(atPush);
    } finally {
      Recorder.prototype.push = original;
    }
  });
});

describe('最良・最悪のデータ', () => {
  const perms = (a: number[]): number[][] =>
    a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));
  const sorts = algorithms.filter((a) => a.category === '整列');
  const cost = (a: (typeof sorts)[number], input: number[]) => {
    const steps = a.trace(input);
    const st = new Map(steps[steps.length - 1].stats.map((s) => [s.label, s.value]));
    return { compares: st.get('比較回数')!, swaps: st.get('交換回数') ?? st.get('移動回数') ?? 0 };
  };

  it.each(sorts.map((a) => [a.id, a] as const))('%s：標準・最良・最悪がそろい、どれも標準データの並べかえ', (_id, a) => {
    expect(a.datasets?.map((d) => d.id)).toEqual(['standard', 'best', 'worst']);
    expect(a.datasets![0].input).toEqual(a.input);
    const key = (xs: number[]) => [...xs].sort((x, y) => x - y).join();
    for (const d of a.datasets!) expect(key(d.input)).toBe(key(a.input));
  });

  // 720 とおりの並べ方をすべて試す。比較回数で決め、比較回数がデータによらず同じ整列は交換回数で決める
  it.each(sorts.map((a) => [a.id, a] as const))('%s：最良は最小、最悪は最大', (_id, a) => {
    const all = perms(a.input).map((p) => cost(a, p));
    const compares = all.map((c) => c.compares);
    const fixed = Math.min(...compares) === Math.max(...compares);
    const metric = (c: { compares: number; swaps: number }) => (fixed ? c.swaps : c.compares);
    const values = all.map(metric);
    const best = a.datasets!.find((d) => d.id === 'best')!;
    const worst = a.datasets!.find((d) => d.id === 'worst')!;
    expect(metric(cost(a, best.input))).toBe(Math.min(...values));
    expect(metric(cost(a, worst.input))).toBe(Math.max(...values));
  });
});
