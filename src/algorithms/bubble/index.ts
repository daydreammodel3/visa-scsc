import type { Algorithm } from '../types';
import { Recorder } from '../recorder';
import pseudo from './code/main.pseudo?raw';
import python from './code/main.py?raw';
import js from './code/main.js?raw';
import cpp from './code/main.cpp?raw';
import rust from './code/main.rs?raw';
import ruby from './code/main.rb?raw';
import perl from './code/main.pl?raw';

const INPUT = [5, 3, 8, 1, 4];

export function traceBubble(input: number[]) {
  const r = new Recorder(input);
  const n = input.length;
  const CMP = '比較回数';
  const SWP = '交換回数';
  r.stats[CMP] = 0;
  r.stats[SWP] = 0;
  const vars = (i: number, j: number | null) => [
    { name: 'i', value: i, index: true },
    { name: 'j', value: j, index: j !== null },
  ];
  const ptr = (i: number, j: number | null) =>
    j === null ? [{ name: 'i', index: i }] : [{ name: 'i', index: i }, { name: 'j', index: j }, { name: 'j+1', index: j + 1 }];

  for (let i = n - 1; i >= 1; i--) {
    r.push({
      point: 'outer',
      vars: vars(i, null),
      pointers: ptr(i, null),
      text: (f) =>
        i === n - 1
          ? `i = ${f(i)}（末尾）。これから、いちばん大きい値を位置 ${f(i)} まで運びます。`
          : `i = ${f(i)}。まだ確定していない範囲（位置 ${f(0)}〜${f(i)}）で、いちばん大きい値を位置 ${f(i)} まで運びます。`,
    });
    for (let j = 0; j < i; j++) {
      r.push({
        point: 'inner',
        vars: vars(i, j),
        pointers: ptr(i, j),
        text: (f) => `j = ${f(j)}。となりどうし（位置 ${f(j)} と ${f(j + 1)}）を見ます。`,
      });
      const a = r.value(j);
      const b = r.value(j + 1);
      r.count(CMP);
      const gt = a > b;
      r.push({
        point: 'cmp',
        vars: vars(i, j),
        pointers: ptr(i, j),
        marks: { [j]: 'compare', [j + 1]: 'compare' },
        text: () => (gt ? `${a} > ${b}。左のほうが大きいので入れかえます。` : `${a} ≦ ${b}。この順番のままで OK。`),
      });
      if (gt) {
        r.swap(j, j + 1);
        r.count(SWP);
        r.push({
          point: 'swap',
          vars: vars(i, j),
          pointers: ptr(i, j),
          marks: { [j]: 'swap', [j + 1]: 'swap' },
          text: () => `${a} と ${b} を入れかえました。大きいほうが右へ 1 つ進みます。`,
        });
      }
    }
    r.sticky[i] = 'sorted';
  }
  r.sticky[0] = 'sorted';
  const [c, s] = [r.stats[CMP], r.stats[SWP]];
  r.push({
    point: null,
    text: () => `整列が終わりました。比較は ${c} 回、交換は ${s} 回でした。`,
  });
  return r.steps;
}

export const bubble: Algorithm = {
  id: 'bubble',
  name: 'バブルソート',
  en: 'Bubble Sort',
  category: '整列',
  level: 1,
  tagline: 'となりどうしを比べて、大きいほうを右へ運ぶ',
  intro: [
    'となりあう 2 つを比べて、左のほうが大きければ入れかえます。',
    'これを左から右へくり返すと、いちばん大きい値が泡（バブル）のように右端へ浮かび上がります。1 周ごとに右端から 1 つずつ確定します。',
  ],
  examPoints: [
    '外側のループ 1 回で、最大値が範囲の右端に確定する',
    '比較回数は入力によらず n(n-1)/2 回（このコードの場合）',
    '交換回数は入力の並びで変わる。最初から整列済みなら 0 回',
    '1 周の間に交換が 1 回もなければ打ち切る改良版もよく出る',
  ],
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', note: '交換がなければ打ち切る改良版は、最良 O(n)' },
  input: INPUT,
  inputIsArray: true,
  trace: () => traceBubble(INPUT),
  expectedOutput: '1 3 4 5 8',
  code: { pseudo, python, js, cpp, rust, ruby, perl },
};
