import type { Algorithm, Mark } from '../types';
import { Recorder } from '../recorder';
import { ASCENDING, SORT_INPUT, SORT_OUTPUT, sortDatasets } from '../sortInput';
import pseudo from './code/main.pseudo?raw';
import python from './code/main.py?raw';
import js from './code/main.js?raw';
import cpp from './code/main.cpp?raw';
import rust from './code/main.rs?raw';
import ruby from './code/main.rb?raw';
import perl from './code/main.pl?raw';

const INPUT = SORT_INPUT;

export function traceSelection(input: number[]) {
  const r = new Recorder(input);
  const n = input.length;
  const CMP = '比較回数';
  const SWP = '交換回数';
  r.stats[CMP] = 0;
  r.stats[SWP] = 0;
  const vars = (i: number, min: number | null, j: number | null) => [
    { name: 'i', value: i, index: true },
    { name: 'minIndex', value: min, index: min !== null },
    { name: 'j', value: j, index: j !== null },
  ];
  const ptr = (i: number, min: number | null, j: number | null) => [
    { name: 'i', index: i },
    ...(min === null ? [] : [{ name: 'min', index: min }]),
    ...(j === null ? [] : [{ name: 'j', index: j }]),
  ];

  for (let i = 0; i < n - 1; i++) {
    r.push({
      point: 'outer',
      vars: vars(i, null, null),
      pointers: ptr(i, null, null),
      text: (f) => `i = ${f(i)}。位置 ${f(i)} に入る値（残りの中で最小の値）を探します。`,
    });
    let min = i;
    const v0 = r.value(i);
    r.push({
      point: 'setmin',
      vars: vars(i, min, null),
      pointers: ptr(i, min, null),
      marks: { [min]: 'min' },
      text: (f) => `ひとまず位置 ${f(i)} の ${v0} を「いまの最小」とします。`,
    });
    for (let j = i + 1; j < n; j++) {
      const m = min;
      r.push({
        point: 'inner',
        vars: vars(i, m, j),
        pointers: ptr(i, m, j),
        marks: { [m]: 'min' },
        text: (f) => `j = ${f(j)}。`,
      });
      const a = r.value(j);
      const b = r.value(m);
      r.count(CMP);
      const lt = a < b;
      r.push({
        point: 'cmp',
        vars: vars(i, m, j),
        pointers: ptr(i, m, j),
        marks: { [m]: 'min', [j]: 'compare' },
        text: () => (lt ? `${a} < ${b}。いまの最小より小さい！` : `${a} ≧ ${b}。いまの最小のほうが小さいので、そのまま。`),
      });
      if (lt) {
        min = j;
        r.push({
          point: 'newmin',
          vars: vars(i, min, j),
          pointers: ptr(i, min, j),
          marks: { [min]: 'min' },
          text: (f) => `minIndex を ${f(j)} に更新。${a} が新しい「いまの最小」です。`,
        });
      }
    }
    const same = min === i;
    const [vi, vm] = [r.value(i), r.value(min)];
    const m = min;
    if (!same) {
      r.swap(i, min);
      r.count(SWP);
    }
    const marks: Partial<Record<number, Mark>> = same ? { [i]: 'min' } : { [i]: 'swap', [m]: 'swap' };
    r.push({
      point: 'swap',
      vars: vars(i, m, null),
      pointers: ptr(i, m, null),
      marks,
      text: (f) =>
        same
          ? `最小の ${vi} はもともと位置 ${f(i)} にあるので、動かしません（同じ場所どうしの入れかえ）。`
          : `最小の ${vm} を位置 ${f(i)} の ${vi} と入れかえます。`,
    });
    r.sticky[i] = 'sorted';
  }
  r.sticky[n - 1] = 'sorted';
  const [c, s] = [r.stats[CMP], r.stats[SWP]];
  r.push({
    point: null,
    text: () => `整列が終わりました。比較は ${c} 回、実際に位置が変わった交換は ${s} 回でした。`,
  });
  return r.steps;
}

export const selection: Algorithm = {
  id: 'selection',
  name: '選択ソート',
  en: 'Selection Sort',
  category: '整列',
  level: 1,
  tagline: '残りの中から最小を選んで、前から順に並べる',
  intro: [
    'まだ並べていない範囲から最小の値を探し、その範囲の先頭と入れかえます。',
    'これをくり返すと、左から順に小さい値が確定していきます。',
  ],
  examPoints: [
    '最小値そのものではなく「最小値の位置（minIndex）」を覚えておく',
    '比較回数は入力によらず n(n-1)/2 回',
    '交換は外側のループ 1 回につき最大 1 回なので、合計で最大 n-1 回（バブルソートより少ない）',
    '安定ではない（同じ値の順番が入れかわることがある）',
  ],
  complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  input: INPUT,
  inputIsArray: true,
  datasets: sortDatasets(
    ASCENDING,
    'すでに昇順なので、最小値はいつも範囲の先頭にあり、位置が変わる交換は 0 回です。比較の回数はデータによらず同じです。',
    [2, 3, 5, 6, 8, 1],
    '最小値がいつも範囲の末尾にあるので、毎回入れかえが起きます（交換 n-1 回で最大）。選択ソートは比較の回数がデータによらず同じなので、変わるのは交換回数だけです。',
  ),
  trace: (input = INPUT) => traceSelection(input),
  expectedOutput: SORT_OUTPUT,
  code: { pseudo, python, js, cpp, rust, ruby, perl },
};
