import { describe, expect, it } from 'vitest';
import { algorithms } from '.';
import { LANGS, parseCode, pointsIn } from '../lib/code';
import { traceBubble } from './bubble';
import { traceSelection } from './selection';
import { traceInsertion } from './insertion';
import { traceLinear } from './linear';
import { traceBinary } from './binary';
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
      expect(s.items).toHaveLength(algo.input.length);
    }
  });

  it.each(LANGS.map((l) => l.id))('%s のコードに、使っている目印がすべてある', (lang) => {
    const pts = pointsIn(algo.code[lang]);
    const used = new Set(steps.map((s) => s.point).filter((p): p is string => p !== null));
    for (const p of used) expect(pts, `${lang} に ⟦${p}⟧ がない`).toContain(p);
    // どの言語も擬似言語と同じ目印を持つ（見つからなかった場合など、サンプルでは通らない行も含めて）
    expect([...pts].sort()).toEqual([...pointsIn(algo.code.pseudo)].sort());
  });

  it.each(LANGS.filter((l) => l.id !== 'pseudo').map((l) => l.id))('%s のサンプル入力が input と同じ', (lang) => {
    const src = parseCode(algo.code[lang])
      .map((l) => l.text)
      .join('\n');
    const nums = algo.input.join(',\\s*');
    expect(src).toMatch(new RegExp(nums));
  });

  it('擬似言語が IPA の書き方（○で始まり、endif などで閉じる）', () => {
    const src = algo.code.pseudo;
    expect(src).toMatch(/^○/);
    expect(src).not.toMatch(/[{};]\s*$/m);
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

describe('整列の結果', () => {
  const rand = lcg(42);
  const cases = [[], [1], [2, 1], [3, 3, 1], [5, 4, 3, 2, 1], [1, 2, 3, 4, 5], ...Array.from({ length: 30 }, () => randomArray(rand, 1 + Math.floor(rand() * 9)))];
  it.each([
    ['bubble', traceBubble],
    ['selection', traceSelection],
    ['insertion', traceInsertion],
  ] as const)('%s は昇順に並べる', (_name, trace) => {
    for (const input of cases) {
      if (input.length < 1) continue;
      const steps = trace(input);
      const last = steps[steps.length - 1];
      expect(values(last)).toEqual([...input].sort((a, b) => a - b));
      expect(last.held ?? null).toBeNull();
      // 途中で要素が消えたり増えたりしない
      for (const s of steps) {
        const vs = [...s.items.filter((x) => x !== null).map((x) => x!.value), ...(s.held ? [s.held.item.value] : [])];
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
    for (const a of algorithms) {
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
