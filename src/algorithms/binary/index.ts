import type { Algorithm, Mark, Pointer } from '../types';
import { Recorder, markRange } from '../recorder';
import pseudo from './code/main.pseudo?raw';
import python from './code/main.py?raw';
import js from './code/main.js?raw';
import c from './code/main.c?raw';
import cpp from './code/main.cpp?raw';
import java from './code/Main.java?raw';
import go from './code/main.go?raw';
import rust from './code/main.rs?raw';
import ruby from './code/main.rb?raw';
import perl from './code/main.pl?raw';

const INPUT = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const TARGET = 23;

export function traceBinary(input: number[], target: number) {
  const r = new Recorder(input);
  const n = input.length;
  const CMP = '比較回数';
  r.stats[CMP] = 0;
  let low = 0;
  let high = n - 1;
  let mid: number | null = null;

  const vars = () => [
    { name: 'target', value: target },
    { name: 'low', value: low, index: true },
    { name: 'high', value: high, index: true },
    { name: 'mid', value: mid, index: mid !== null },
  ];
  const pointers = (): Pointer[] => {
    const p: Pointer[] = [
      { name: 'low', index: low },
      { name: 'high', index: high },
    ];
    if (mid !== null) p.push({ name: 'mid', index: mid });
    return p;
  };
  /** low〜high の外は「もう探さない」 */
  const outside = (extra: Partial<Record<number, Mark>> = {}) => ({
    ...markRange(n, (i) => i < low || i > high, 'out'),
    ...extra,
  });

  const [low0, high0] = [low, high];
  r.push({
    point: 'init',
    vars: vars(),
    pointers: pointers(),
    marks: outside(),
    text: (f) => `探す範囲を配列全体にします。low = ${f(low0)}（先頭）、high = ${f(high0)}（末尾）。二分探索は「昇順に並んでいる」ことが前提です。`,
  });

  while (true) {
    const ok = low <= high;
    const [lo, hi] = [low, high];
    r.push({
      point: 'loop',
      vars: vars(),
      pointers: pointers(),
      marks: outside(),
      text: (f) =>
        ok
          ? `low（${f(lo)}）≦ high（${f(hi)}）なので、まだ探す範囲が残っています。`
          : `low（${f(lo)}）> high（${f(hi)}）になり、探す範囲がなくなりました。`,
    });
    if (!ok) break;

    const m = Math.floor((low + high) / 2);
    mid = m;
    r.push({
      point: 'mid',
      vars: vars(),
      pointers: pointers(),
      marks: outside({ [m]: 'compare' }),
      text: (f) => `まんなかの位置 mid = (${f(lo)} + ${f(hi)}) ÷ 2 の商 = ${f(m)}。`,
    });

    const v = r.value(m);
    r.count(CMP);
    const eq = v === target;
    r.push({
      point: 'cmp',
      vars: vars(),
      pointers: pointers(),
      marks: outside({ [m]: 'compare' }),
      text: (f) => `data[${f(m)}] は ${v}。target の ${target} と${eq ? '同じです！' : '違います。'}`,
    });
    if (eq) {
      r.push({
        point: 'found',
        vars: vars(),
        pointers: pointers(),
        marks: outside({ [m]: 'found' }),
        text: (f) => `見つかりました。位置 ${f(m)} を返します。`,
      });
      return r.steps;
    }

    const lt = v < target;
    r.push({
      point: 'lt',
      vars: vars(),
      pointers: pointers(),
      marks: outside({ [m]: 'compare' }),
      text: () =>
        lt
          ? `${v} < ${target}。探している値はもっと右（大きい側）にあるはずです。`
          : `${v} > ${target}。探している値はもっと左（小さい側）にあるはずです。`,
    });
    if (lt) {
      low = m + 1;
      r.push({
        point: 'right',
        vars: vars(),
        pointers: pointers(),
        marks: outside(),
        text: (f) => `low を mid + 1 = ${f(m + 1)} にして、左半分を候補から外します。`,
      });
    } else {
      high = m - 1;
      r.push({
        point: 'left',
        vars: vars(),
        pointers: pointers(),
        marks: outside(),
        text: (f) => `high を mid - 1 = ${f(m - 1)} にして、右半分を候補から外します。`,
      });
    }
  }

  r.push({
    point: 'notfound',
    vars: vars(),
    marks: outside(),
    text: () => `${target} は見つかりませんでした。-1 を返します。`,
  });
  return r.steps;
}

export const binary: Algorithm = {
  id: 'binary',
  name: '二分探索',
  en: 'Binary Search',
  category: '探索',
  level: 2,
  tagline: 'まんなかを見て、探す範囲を半分ずつにしぼる',
  intro: [
    '昇順に並んだ配列で、探す範囲のまんなか（mid）の値と target を比べます。',
    'mid の値が小さければ右半分、大きければ左半分だけを探せばよいので、1 回比べるたびに範囲が半分になります。',
  ],
  examPoints: [
    'mid の計算（(low + high) ÷ 2 の商）と、low・high の更新が mid ± 1 になっていること',
    'ループの条件が low ≦ high（< にすると要素が 1 つのときに探せない）',
    '最大の比較回数はおよそ log₂n + 1 回。要素数 1000 なら 10 回程度',
    '前提：データが整列済みであること',
  ],
  complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  input: INPUT,
  inputIsArray: true,
  target: TARGET,
  trace: (input = INPUT) => traceBinary(input, TARGET),
  expectedOutput: '5',
  code: { pseudo, python, js, c, cpp, java, go, rust, ruby, perl },
};
