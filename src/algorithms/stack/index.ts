import type { Algorithm, Var } from '../types';
import { Recorder } from '../recorder';
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

export type Op = { op: 'push'; value: number } | { op: 'pop' };

const SIZE = 5;
const OPS: Op[] = [
  { op: 'push', value: 3 },
  { op: 'push', value: 8 },
  { op: 'push', value: 5 },
  { op: 'pop' },
  { op: 'push', value: 1 },
  { op: 'pop' },
  { op: 'pop' },
];

export function traceStack(size: number, ops: Op[]) {
  const r = new Recorder(Array(size).fill(null));
  let top = -1;
  const out: number[] = [];
  const vars = (x: number | null): Var[] => [
    { name: 'x', value: x },
    { name: 'top', value: top, index: true },
    { name: '取り出した順', value: out.length ? out.join(' ') : null },
  ];
  const ptr = () => [{ name: 'top', index: top }];

  for (const o of ops) {
    if (o.op === 'push') {
      const x = o.value;
      const full = top === size - 1;
      const t0 = top;
      r.held = null;
      r.push({
        point: 'full',
        vars: vars(x),
        pointers: ptr(),
        text: (f) =>
          `push(${x})：top（${f(t0)}）が${full ? '最後の位置なので、いっぱいです。' : '最後の位置ではないので、まだ積めます。'}`,
      });
      if (full) continue;
      top++;
      const item = r.newItem(x);
      r.held = { item, over: top };
      const t1 = top;
      r.push({
        point: 'inc',
        vars: vars(x),
        pointers: ptr(),
        text: (f) => `top を 1 増やして ${f(t1)} にします。ここが新しい「いちばん上」です。`,
      });
      r.held = null;
      r.items[top] = item;
      r.push({
        point: 'store',
        vars: vars(x),
        pointers: ptr(),
        marks: { [top]: 'swap' },
        text: (f) => `stack[${f(t1)}] に ${x} を入れました。`,
      });
    } else {
      const empty = top === -1;
      const t0 = top;
      r.held = null;
      r.push({
        point: 'empty',
        vars: vars(null),
        pointers: ptr(),
        text: (f) => `pop()：top は ${f(t0)}。${empty ? '空なので取り出せません。' : '空ではないので取り出せます。'}`,
      });
      if (empty) continue;
      const item = r.items[top]!;
      const x = item.value;
      r.items[top] = null;
      r.held = { item, over: top, mark: 'found' };
      r.push({
        point: 'take',
        vars: vars(x),
        pointers: ptr(),
        text: (f) => `いちばん上の stack[${f(t0)}] = ${x} を x に取り出します。最後に積んだものが最初に出る「後入れ先出し（LIFO）」です。`,
      });
      top--;
      const t1 = top;
      r.push({
        point: 'dec',
        vars: vars(x),
        pointers: ptr(),
        text: (f) =>
          `top を 1 減らして ${f(t1)} にします。${t1 === -1 ? '（スタックは空になりました）' : ''}配列に値が残っていても、top より上は「使っていない場所」として扱います。`,
      });
      out.push(x);
      r.push({
        point: 'popret',
        vars: vars(x),
        pointers: ptr(),
        text: () => `${x} を返します。`,
      });
    }
  }
  r.held = null;
  const result = out.join(' ');
  r.push({
    point: null,
    vars: vars(null),
    pointers: ptr(),
    text: () => `取り出した順は ${result}。後から積んだものほど先に出てきました。`,
  });
  return r.steps;
}

export const stack: Algorithm = {
  id: 'stack',
  name: 'スタック',
  en: 'Stack',
  category: 'データ構造',
  level: 1,
  tagline: '最後に入れたものから取り出す（後入れ先出し）',
  intro: [
    '配列と、いちばん上の位置を指す変数 top でスタックを作ります。',
    'push は top を 1 増やしてから値を入れ、pop は top の値を取り出してから top を 1 減らします。この例では push(3), push(8), push(5), pop(), push(1), pop(), pop() の順に呼び出します。',
  ],
  examPoints: [
    'push と pop で、top を動かす順番と値を読み書きする順番が逆になる',
    'top の初期値（擬似言語では 0、0 始まりの言語では -1）と「空」「いっぱい」の判定',
    'LIFO（Last In, First Out）。関数呼び出しのコールスタックや、深さ優先探索で使われる',
  ],
  complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'push・pop はどちらも 1 回の操作で済む' },
  input: [],
  view: { label: 'stack', heldLabel: 'x' },
  trace: () => traceStack(SIZE, OPS),
  expectedOutput: '5 1 8',
  code: { pseudo, python, js, c, cpp, java, go, rust, swift, ruby, perl },
};
