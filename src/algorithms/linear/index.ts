import type { Algorithm } from '../types';
import { Recorder } from '../recorder';
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

const INPUT = [7, 3, 9, 4, 6, 2];
const TARGET = 4;

export function traceLinear(input: number[], target: number) {
  const r = new Recorder(input);
  const n = input.length;
  const CMP = '比較回数';
  r.stats[CMP] = 0;
  const vars = (i: number | null) => [
    { name: 'target', value: target },
    { name: 'i', value: i, index: i !== null },
  ];
  const misses: Record<number, 'miss'> = {};

  for (let i = 0; i < n; i++) {
    r.push({
      point: 'loop',
      pointers: [{ name: 'i', index: i }],
      vars: vars(i),
      marks: { ...misses },
      text: (f) => (i === 0 ? `i を ${f(0)} にして、先頭から順に見ていきます。` : `i を 1 増やして ${f(i)} にします。`),
    });
    const v = r.value(i);
    r.count(CMP);
    const hit = v === target;
    r.push({
      point: 'cmp',
      pointers: [{ name: 'i', index: i }],
      vars: vars(i),
      marks: { ...misses, [i]: 'compare' },
      text: (f) => `data[${f(i)}] は ${v}。target の ${target} と比べると… ${hit ? '同じ！' : '違います。'}`,
    });
    if (hit) {
      r.push({
        point: 'found',
        pointers: [{ name: 'i', index: i }],
        vars: vars(i),
        marks: { ...misses, [i]: 'found' },
        text: (f) => `見つかりました。位置 ${f(i)} を返して終わります（比較は ${i + 1} 回）。`,
      });
      return r.steps;
    }
    misses[i] = 'miss';
  }
  r.push({
    point: 'notfound',
    vars: vars(null),
    marks: { ...misses },
    text: () => `最後まで見ても ${target} はありませんでした。「見つからない」印として -1 を返します。`,
  });
  return r.steps;
}

export const linear: Algorithm = {
  id: 'linear',
  name: '線形探索',
  en: 'Linear Search',
  category: '探索',
  level: 1,
  tagline: '先頭から 1 つずつ、順番に確かめていく',
  intro: [
    '配列の先頭から順に、探している値（target）と同じかどうかを 1 つずつ比べます。',
    '並び順に関係なく使えるのが長所です。そのかわり、要素が多いほど時間がかかります。',
  ],
  examPoints: [
    '見つからなかったときに何を返すか（-1 や 0 など、問題文の約束を確認）',
    '比較回数：見つかる位置が k 番目なら k 回、見つからなければ要素数と同じ回数',
    '番兵法：末尾に target を置いて「範囲のチェック」を省く工夫もよく出る',
  ],
  complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  input: INPUT,
  inputIsArray: true,
  target: TARGET,
  trace: (input = INPUT) => traceLinear(input, TARGET),
  expectedOutput: '3',
  code: { pseudo, python, js, c, cpp, java, go, rust, ruby, perl },
};
