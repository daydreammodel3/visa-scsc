import type { Algorithm } from '../types';
import { Recorder, markRange } from '../recorder';
import { ASCENDING, DESCENDING, SORT_INPUT, SORT_OUTPUT, sortDatasets } from '../sortInput';
import pseudo from './code/main.pseudo?raw';
import python from './code/main.py?raw';
import js from './code/main.js?raw';
import c from './code/main.c?raw';
import cpp from './code/main.cpp?raw';
import java from './code/Main.java?raw';
import go from './code/main.go?raw';
import rust from './code/main.rs?raw';
import swift from './code/main.swift?raw';
import ruby from './code/main.rb?raw';
import perl from './code/main.pl?raw';

const INPUT = SORT_INPUT;

export function traceInsertion(input: number[]) {
  const r = new Recorder(input);
  const n = input.length;
  const CMP = '比較回数';
  const MOV = '移動回数';
  r.stats[CMP] = 0;
  r.stats[MOV] = 0;
  const vars = (i: number, j: number | null, key: number | null) => [
    { name: 'i', value: i, index: true },
    { name: 'key', value: key },
    { name: 'j', value: j, index: j !== null },
  ];
  const ptr = (i: number, j: number | null) => [{ name: 'i', index: i }, ...(j === null ? [] : [{ name: 'j', index: j }])];

  for (let i = 1; i < n; i++) {
    r.push({
      point: 'outer',
      vars: vars(i, null, null),
      pointers: ptr(i, null),
      marks: markRange(n, (k) => k < i, 'sorted'),
      text: (f) => `i = ${f(i)}。位置 ${f(0)}〜${f(i - 1)} はもう小さい順に並んでいます。ここへ位置 ${f(i)} の値を差しこみます。`,
    });

    const item = r.items[i]!;
    const key = item.value;
    r.items[i] = null;
    r.held = { item, over: i };
    let j = i - 1;
    const j0 = j;
    r.push({
      point: 'key',
      vars: vars(i, j, key),
      pointers: ptr(i, j),
      marks: markRange(n, (k) => k < i, 'sorted'),
      text: (f) => `key = ${key} を持ち上げて、空いた場所を作ります。j = ${f(j0)}（そのすぐ左）から比べていきます。`,
    });

    while (true) {
      const jj = j;
      if (jj < 0) {
        r.push({
          point: 'cmp',
          vars: vars(i, jj, key),
          pointers: ptr(i, jj),
          marks: markRange(n, (k) => k <= i && r.items[k] !== null, 'sorted'),
          text: (f) => `j = ${f(jj)} は配列の外です。左端まで来たので、くり返しを終えます。`,
        });
        break;
      }
      const v = r.value(jj);
      r.count(CMP);
      const gt = v > key;
      r.push({
        point: 'cmp',
        vars: vars(i, jj, key),
        pointers: ptr(i, jj),
        marks: { ...markRange(n, (k) => k <= i && r.items[k] !== null, 'sorted'), [jj]: 'compare' },
        text: (f) =>
          gt
            ? `data[${f(jj)}] = ${v} > key（${key}）。${v} を右へずらします。`
            : `data[${f(jj)}] = ${v} ≦ key（${key}）。key はこのすぐ右に入ります。`,
      });
      if (!gt) break;
      r.items[jj + 1] = r.items[jj];
      r.items[jj] = null;
      r.held = { item, over: jj };
      r.count(MOV);
      j = jj - 1;
      r.push({
        point: 'shift',
        vars: vars(i, j, key),
        pointers: ptr(i, j),
        marks: { ...markRange(n, (k) => k <= i && r.items[k] !== null, 'sorted'), [jj + 1]: 'swap' },
        text: (f) => `${v} を位置 ${f(jj + 1)} へずらし、j を 1 減らして ${f(jj - 1)} にします。（実際の配列では data[${f(jj + 1)}] に ${v} がコピーされます）`,
      });
    }

    const at = j + 1;
    r.items[at] = item;
    r.held = null;
    r.push({
      point: 'insert',
      vars: vars(i, j, key),
      pointers: ptr(i, j),
      marks: { ...markRange(n, (k) => k <= i, 'sorted'), [at]: 'swap' },
      text: (f) => `空いている位置 ${f(at)}（j + 1）に key の ${key} を入れます。位置 ${f(0)}〜${f(i)} が小さい順になりました。`,
    });
  }
  r.sticky = markRange(n, () => true, 'sorted');
  const [c, m] = [r.stats[CMP], r.stats[MOV]];
  r.push({
    point: null,
    text: () => `整列が終わりました。比較は ${c} 回、ずらした回数は ${m} 回でした。`,
  });
  return r.steps;
}

export const insertion: Algorithm = {
  id: 'insertion',
  name: '挿入ソート',
  en: 'Insertion Sort',
  category: '整列',
  level: 2,
  tagline: 'トランプの手札のように、正しい場所へ差しこむ',
  intro: [
    '左側を「並べ終わった列」として、右から 1 つずつ取り出し（key）、正しい場所に差しこみます。',
    'key より大きい値を右へ 1 つずつずらしていき、空いたところへ key を入れます。',
  ],
  examPoints: [
    'key を別の変数に退避してから、大きい値を右へずらす（上書きしても値が消えない）',
    'while の条件 j ≧ 1 and data[j] > key の順番（範囲チェックが先）',
    'ほぼ整列済みのデータでは比較・移動がとても少なく、速い（最良 O(n)）',
    '安定な整列（同じ値の順番は変わらない）',
  ],
  complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  input: INPUT,
  inputIsArray: true,
  datasets: sortDatasets(
    ASCENDING,
    'すでに昇順なので、key はいつもその場所のまま。比較は n-1 回、ずらしは 0 回で、O(n) で終わります。',
    DESCENDING,
    '逆順（降順）なので、key を毎回いちばん左まで運びます。比較もずらしも n(n-1)/2 回で最大です。',
  ),
  trace: (input = INPUT) => traceInsertion(input),
  expectedOutput: SORT_OUTPUT,
  code: { pseudo, python, js, c, cpp, java, go, rust, swift, ruby, perl },
};
