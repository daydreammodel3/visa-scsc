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
import ruby from './code/main.rb?raw';
import perl from './code/main.pl?raw';

export type QOp = { op: 'enqueue'; value: number } | { op: 'dequeue' };

const SIZE = 4;
const OPS: QOp[] = [
  { op: 'enqueue', value: 3 },
  { op: 'enqueue', value: 8 },
  { op: 'enqueue', value: 5 },
  { op: 'dequeue' },
  { op: 'enqueue', value: 1 },
  { op: 'enqueue', value: 7 },
  { op: 'dequeue' },
  { op: 'dequeue' },
];

export function traceQueue(size: number, ops: QOp[]) {
  const r = new Recorder(Array(size).fill(null));
  let head = 0;
  let tail = 0;
  let count = 0;
  const out: number[] = [];
  const vars = (x: number | null): Var[] => [
    { name: 'x', value: x },
    { name: 'head', value: head, index: true },
    { name: 'tail', value: tail, index: true },
    { name: 'count', value: count },
    { name: '取り出した順', value: out.length ? out.join(' ') : null },
  ];
  const ptr = () => [
    { name: 'head', index: head },
    { name: 'tail', index: tail },
  ];

  for (const o of ops) {
    if (o.op === 'enqueue') {
      const x = o.value;
      const full = count === size;
      const c0 = count;
      const item = r.newItem(x);
      r.held = full ? null : { item, over: tail };
      r.push({
        point: 'full',
        vars: vars(x),
        pointers: ptr(),
        text: () => `enqueue(${x})：count は ${c0}。${full ? 'いっぱいなので入れられません。' : 'まだ空きがあります。'}`,
      });
      if (full) continue;
      const t0 = tail;
      r.held = null;
      r.items[tail] = item;
      r.push({
        point: 'store',
        vars: vars(x),
        pointers: ptr(),
        marks: { [t0]: 'swap' },
        text: (f) => `queue[${f(t0)}]（tail の位置）に ${x} を入れます。`,
      });
      tail = (tail + 1) % size;
      count++;
      const t1 = tail;
      const c1 = count;
      const wrapped = t1 === 0;
      r.push({
        point: 'tail',
        vars: vars(x),
        pointers: ptr(),
        text: (f) =>
          wrapped
            ? `tail を進めると配列の端を越えるので、先頭の ${f(0)} に戻ります（余りを使って輪のようにつなぐ「リングバッファ」）。count は ${c1} に。`
            : `tail を 1 進めて ${f(t1)} に。count は ${c1} になりました。`,
      });
    } else {
      const empty = count === 0;
      r.held = null;
      const c0 = count;
      r.push({
        point: 'empty',
        vars: vars(null),
        pointers: ptr(),
        text: () => `dequeue()：count は ${c0}。${empty ? '空なので取り出せません。' : '取り出せます。'}`,
      });
      if (empty) continue;
      const h0 = head;
      const item = r.items[head]!;
      const x = item.value;
      r.items[head] = null;
      r.held = { item, over: h0, mark: 'found' };
      r.push({
        point: 'take',
        vars: vars(x),
        pointers: ptr(),
        text: (f) => `先頭の queue[${f(h0)}] = ${x} を x に取り出します。最初に入れたものが最初に出る「先入れ先出し（FIFO）」です。`,
      });
      head = (head + 1) % size;
      count--;
      const h1 = head;
      const c2 = count;
      r.push({
        point: 'head',
        vars: vars(x),
        pointers: ptr(),
        text: (f) => `head を 1 進めて ${f(h1)} に${h1 === 0 ? '（端を越えたので先頭に戻る）' : ''}。count は ${c2} になりました。`,
      });
      out.push(x);
      r.push({
        point: 'deqret',
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
    text: () => `取り出した順は ${result}。入れた順のまま出てきました。`,
  });
  return r.steps;
}

export const queue: Algorithm = {
  id: 'queue',
  name: 'キュー',
  en: 'Queue',
  category: 'データ構造',
  level: 2,
  tagline: '最初に入れたものから取り出す（先入れ先出し）',
  intro: [
    '配列と、先頭を指す head・次に入れる位置を指す tail・個数 count でキューを作ります。',
    '端まで来たら先頭に戻って空いた場所を使い回します（リングバッファ）。この例では enqueue(3), enqueue(8), enqueue(5), dequeue(), enqueue(1), enqueue(7), dequeue(), dequeue() の順に呼び出します。',
  ],
  examPoints: [
    'FIFO（First In, First Out）。待ち行列、幅優先探索、印刷待ちなどで使われる',
    '位置を進める式：0 始まりなら (tail + 1) mod n、1 始まり（擬似言語）なら (tail mod n) + 1',
    'head = tail だけでは「空」と「満杯」を区別できない。count を持つか、1 つ空けておく',
  ],
  complexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)', note: 'enqueue・dequeue はどちらも 1 回の操作で済む' },
  input: [],
  view: { label: 'queue', heldLabel: 'x' },
  trace: () => traceQueue(SIZE, OPS),
  expectedOutput: '3 8 5',
  code: { pseudo, python, js, c, cpp, java, go, rust, ruby, perl },
};
