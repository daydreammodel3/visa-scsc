import type { Algorithm, Pointer, Var } from '../types';
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

export type LOp = { op: 'append'; value: number } | { op: 'remove'; value: number };

const OPS: LOp[] = [
  { op: 'append', value: 3 },
  { op: 'append', value: 8 },
  { op: 'append', value: 5 },
  { op: 'append', value: 1 },
  { op: 'remove', value: 8 },
];

/**
 * items は「リストをたどる順」に並べる（配列の位置ではない）。
 * 新しく作った要素や外した要素は held として上の段に描く。
 */
export function traceLinkedList(ops: LOp[]) {
  const cap = ops.filter((o) => o.op === 'append').length + 1;
  const r = new Recorder(Array(cap).fill(null));
  let len = 0;
  const show = (pos: number | null) => (pos === null || pos < 0 || pos >= cap ? '未定義' : `要素(${r.items[pos]?.value ?? r.held?.item.value})`);
  const node = (pos: number | null): string => show(pos);
  const vars = (x: number, prev: number | null, curr: number | null): Var[] => [
    { name: 'x', value: x },
    { name: 'listHead', value: firstVal() === undefined ? '未定義' : `要素(${firstVal()})` },
    { name: 'prev', value: prev === null ? '未定義' : node(prev) },
    { name: 'curr', value: curr === null ? '未定義' : node(curr) },
  ];
  function firstVal(): number | undefined {
    return r.items.find((it) => it !== null)?.value;
  }
  const ptr = (prev: number | null, curr: number | null): Pointer[] => [
    ...(firstVal() === undefined ? [] : [{ name: 'listHead', index: r.items.findIndex((it) => it !== null) }]),
    ...(prev === null ? [] : [{ name: 'prev', index: prev }]),
    ...(curr === null ? [] : [{ name: 'curr', index: curr }]),
  ];

  for (const o of ops) {
    const x = o.value;
    if (o.op === 'append') {
      r.held = null;
      const item = r.newItem(x);
      r.held = { item, over: len };
      const at = len;
      r.push({
        point: 'new',
        vars: vars(x, null, at),
        pointers: ptr(null, at),
        text: () => `append(${x})：値が ${x} で、next が未定義の新しい要素を作り、curr で指します。まだリストにはつながっていません。`,
      });
      const empty = len === 0;
      r.push({
        point: 'empty',
        vars: vars(x, null, at),
        pointers: ptr(null, at),
        text: () => (empty ? 'listHead が未定義、つまりリストは空です。' : 'listHead は未定義ではないので、末尾までたどります。'),
      });
      if (empty) {
        r.held = null;
        r.items[0] = item;
        len = 1;
        r.push({
          point: 'sethead',
          vars: vars(x, null, 0),
          pointers: ptr(null, 0),
          marks: { 0: 'swap' },
          text: () => `listHead に curr を入れます。${x} がリストの先頭になりました。`,
        });
        continue;
      }
      let prev = 0;
      const v0 = r.value(0);
      r.push({
        point: 'walk0',
        vars: vars(x, prev, at),
        pointers: ptr(prev, at),
        text: () => `prev ← listHead。先頭の要素(${v0}) から、たどり始めます。`,
      });
      while (true) {
        const p = prev;
        const hasNext = p + 1 < len;
        const vp = r.value(p);
        r.push({
          point: 'walk',
          vars: vars(x, p, at),
          pointers: ptr(p, at),
          marks: { [p]: 'compare' },
          text: () =>
            hasNext
              ? `要素(${vp}) の next は未定義ではない（次がある）ので、まだ末尾ではありません。`
              : `要素(${vp}) の next は未定義。ここが末尾です。`,
        });
        if (!hasNext) break;
        prev = p + 1;
        const q = prev;
        const vq = r.value(q);
        r.push({
          point: 'step',
          vars: vars(x, q, at),
          pointers: ptr(q, at),
          text: () => `prev ← prev.next。矢印をたどって要素(${vq}) へ進みます。`,
        });
      }
      r.held = null;
      r.items[at] = item;
      len++;
      const last = prev;
      const vl = r.value(last);
      r.push({
        point: 'link',
        vars: vars(x, last, at),
        pointers: ptr(last, at),
        marks: { [at]: 'swap' },
        text: () => `prev.next ← curr。要素(${vl}) の矢印を新しい要素(${x}) へ向けて、末尾につなぎました。`,
      });
    } else {
      r.held = null;
      let prev: number | null = null;
      let curr = 0;
      r.push({
        point: 'rstart',
        vars: vars(x, prev, curr),
        pointers: ptr(prev, curr),
        text: () => `remove(${x})：prev は未定義、curr は先頭の要素から始めます。`,
      });
      while (true) {
        const c = curr;
        const p = prev;
        const has = c < len;
        r.push({
          point: 'rloop',
          vars: vars(x, p, has ? c : null),
          pointers: ptr(p, has ? c : null),
          text: () => (has ? 'curr は未定義ではないので、調べます。' : `curr が未定義になりました。${x} はリストにありません。`),
        });
        if (!has) break;
        const v = r.value(c);
        const hit = v === x;
        r.push({
          point: 'rcmp',
          vars: vars(x, p, c),
          pointers: ptr(p, c),
          marks: { [c]: hit ? 'found' : 'compare' },
          text: () => (hit ? `curr.val は ${v}。見つかりました！` : `curr.val は ${v}。${x} ではありません。`),
        });
        if (hit) {
          const atHead = p === null;
          r.push({
            point: 'rhead',
            vars: vars(x, p, c),
            pointers: ptr(p, c),
            marks: { [c]: 'found' },
            text: () => (atHead ? 'prev が未定義なので、外すのは先頭の要素です。' : 'prev があるので、途中の要素を外します。'),
          });
          const item = r.items[c]!;
          const nextVal = r.items[c + 1]?.value;
          const prevVal = p === null ? undefined : r.value(p);
          r.items[c] = null;
          r.held = { item, over: c, mark: 'out' };
          r.push({
            point: atHead ? 'unhead' : 'unlink',
            vars: vars(x, p, c),
            pointers: ptr(p, c),
            text: () => {
              const to = nextVal === undefined ? '未定義' : `要素(${nextVal})`;
              return atHead
                ? `listHead ← curr.next。listHead を ${to} に付けかえます。`
                : `prev.next ← curr.next。要素(${prevVal}) の矢印を、要素(${v}) を飛ばして ${to} へ付けかえます。`;
            },
          });
          // 外れた要素をどけて、つめて描く
          r.items.splice(c, 1);
          r.items.push(null);
          len--;
          r.held = null;
          r.push({
            point: 'rdone',
            vars: vars(x, null, null),
            pointers: ptr(null, null),
            text: () => `要素(${v}) は、もうどこからもたどれません。リストから外れました。ほかの要素は 1 つも動かしていません（配列なら後ろをずらす必要があります）。`,
          });
          break;
        }
        prev = c;
        curr = c + 1;
        const [p2, c2] = [prev, curr];
        r.push({
          point: 'radv',
          vars: vars(x, p2, c2 < len ? c2 : null),
          pointers: ptr(p2, c2 < len ? c2 : null),
          text: () => 'prev ← curr、curr ← curr.next。2 つそろって 1 つ先へ進みます。',
        });
      }
    }
  }
  const vals = r.items.filter((it) => it !== null).map((it) => it!.value);
  r.push({
    point: null,
    pointers: ptr(null, null),
    vars: [{ name: 'リストの中身', value: vals.join(' → ') }],
    text: () => `先頭からたどると ${vals.join(' → ')}。`,
  });
  return r.steps;
}

export const linkedlist: Algorithm = {
  id: 'linkedlist',
  name: '線形リスト',
  en: 'Linked List',
  category: 'データ構造',
  level: 2,
  tagline: '各要素が「次の要素」を指して、1 列につながる',
  intro: [
    '要素は、値（val）と次の要素への参照（next）を持ちます。先頭の要素は listHead が指し、最後の要素の next は未定義です。',
    'append は末尾までたどってつなぎ、remove は 1 つ手前の要素（prev）の next を付けかえて外します。この例では 3, 8, 5, 1 を追加してから 8 を外します。',
  ],
  examPoints: [
    '要素を外すときは「1 つ手前の要素の next」を付けかえる。だから prev と curr の 2 つでたどる',
    '先頭の要素を外す・追加するときだけは listHead を書きかえる（場合分けに注意）',
    '途中への追加・削除は付けかえだけで済む（配列のように後ろをずらさなくてよい）',
    'k 番目の要素へは先頭から順にたどるしかない（O(n)）',
  ],
  complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', note: '末尾への追加は末尾までたどるので O(n)。末尾を指す変数を持てば O(1)' },
  input: [],
  view: { cells: false, links: true, indices: false, label: 'リスト', heldLabel: '' },
  trace: () => traceLinkedList(OPS),
  expectedOutput: '3 5 1',
  code: { pseudo, python, js, c, cpp, java, go, rust, swift, ruby, perl },
};
