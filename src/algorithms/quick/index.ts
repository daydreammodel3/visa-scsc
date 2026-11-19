import type { Algorithm, Mark, Pointer, Var } from '../types';
import { Recorder, markRange } from '../recorder';
import { ASCENDING, SORT_INPUT, SORT_OUTPUT, sortDatasets } from '../sortInput';
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

export function traceQuick(input: number[]) {
  const r = new Recorder(input);
  const n = input.length;
  r.frames = [];
  const CMP = '比較回数';
  const SWP = '交換回数';
  r.stats[CMP] = 0;
  r.stats[SWP] = 0;

  /** 今の範囲の外は眠らせる（位置が確定したものはそのまま） */
  const focus = (l: number, rr: number, extra: Partial<Record<number, Mark>> = {}) => ({
    ...markRange(n, (x) => (x < l || x > rr) && r.sticky[x] !== 'sorted', 'out'),
    ...extra,
  });

  const partition = (left: number, right: number): number => {
    r.call((f) => `partition(${f(left)}, ${f(right)})`);
    const pivot = r.value(right);
    let i = left - 1;
    let j: number | null = null;
    const vars = (): Var[] => [
      { name: 'left', value: left, index: true },
      { name: 'right', value: right, index: true },
      { name: 'pivot', value: pivot },
      { name: 'i', value: i, index: true },
      { name: 'j', value: j, index: j !== null },
    ];
    const ptr = (): Pointer[] => [{ name: 'i', index: i }, ...(j === null ? [] : [{ name: 'j', index: j }])];
    r.push({
      point: 'pcall',
      vars: vars(),
      pointers: [],
      marks: focus(left, right),
      text: (f) => `partition(${f(left)}, ${f(right)})：範囲を「基準値以下」と「基準値より大きい」に分けます。`,
    });
    const iStart = i;
    r.push({
      point: 'pivot',
      vars: vars(),
      pointers: ptr(),
      marks: focus(left, right, { [right]: 'pivot' }),
      text: (f) => `右端の ${pivot} を基準値（pivot）にします。i = ${f(iStart)} は「基準値以下のグループ」の右端（まだ空）です。`,
    });
    for (let jj = left; jj < right; jj++) {
      j = jj;
      const v = r.value(jj);
      r.count(CMP);
      const le = v <= pivot;
      const i0 = i;
      r.push({
        point: 'pcmp',
        vars: vars(),
        pointers: ptr(),
        marks: focus(left, right, { [right]: 'pivot', [jj]: 'compare' }),
        text: () => (le ? `data[j] = ${v} ≦ ${pivot}。基準値以下のグループに入れます。` : `data[j] = ${v} > ${pivot}。大きいグループなので、そのまま。`),
      });
      if (le) {
        i = i0 + 1;
        const ii = i;
        const same = ii === jj;
        if (!same) {
          r.swap(ii, jj);
          r.count(SWP);
        }
        r.push({
          point: 'pswap',
          vars: vars(),
          pointers: ptr(),
          marks: focus(left, right, same ? { [right]: 'pivot' } : { [right]: 'pivot', [ii]: 'swap', [jj]: 'swap' }),
          text: (f) =>
            same
              ? `i を 1 増やして ${f(ii)}。i と j が同じ位置なので、入れかえても変わりません。`
              : `i を 1 増やして ${f(ii)}。data[${f(ii)}] と data[${f(jj)}] を入れかえて、${v} をグループの右端へ。`,
        });
      }
    }
    const p = i + 1;
    const moved = p !== right;
    if (moved) {
      r.swap(p, right);
      r.count(SWP);
    }
    j = null;
    r.sticky[p] = 'sorted';
    r.push({
      point: 'pfinal',
      vars: vars(),
      pointers: ptr(),
      marks: focus(left, right, moved ? { [p]: 'swap', [right]: 'swap' } : {}),
      text: (f) =>
        `基準値 ${pivot} を、グループの境目 i + 1 = ${f(p)} に${moved ? '入れかえて' : ''}置きます。${pivot} の左は ${pivot} 以下、右は ${pivot} より大きくなり、${pivot} の位置が確定しました。`,
    });
    r.setTop({ ret: p, retIndex: true, state: 'returning' });
    r.push({
      point: 'pret',
      vars: vars(),
      pointers: [{ name: 'p', index: p }],
      marks: focus(left, right),
      text: (f) => `基準値の位置 ${f(p)} を返します。`,
    });
    r.ret();
    return p;
  };

  const sort = (left: number, right: number) => {
    r.call((f) => `quickSort(${f(left)}, ${f(right)})`);
    const base: Var[] = [
      { name: 'left', value: left, index: true },
      { name: 'right', value: right, index: true },
    ];
    const lr: Pointer[] = [
      { name: 'left', index: left },
      { name: 'right', index: right },
    ];
    r.push({
      point: 'call',
      vars: base,
      pointers: lr,
      marks: focus(left, right),
      text: (f) => `quickSort(${f(left)}, ${f(right)}) が呼ばれました。`,
    });
    const go = left < right;
    if (!go && left === right) r.sticky[left] = 'sorted';
    r.push({
      point: 'base',
      vars: base,
      pointers: lr,
      marks: focus(left, right),
      text: () =>
        go ? '要素が 2 つ以上あるので、分割します。' : left === right ? '要素が 1 つだけなので、位置は確定です。何もせず戻ります。' : '範囲が空なので、何もせず戻ります。',
    });
    if (!go) {
      r.ret();
      return;
    }
    r.setTop({ note: () => 'partition の結果を待っています' });
    r.push({
      point: 'part',
      vars: base,
      pointers: lr,
      marks: focus(left, right),
      text: (f) => `partition(${f(left)}, ${f(right)}) を呼び出して、基準値で 2 つに分けます。`,
    });
    const p = partition(left, right);
    const withP: Var[] = [...base, { name: 'p', value: p, index: true }];
    const ptrP: Pointer[] = [...lr, { name: 'p', index: p }];
    r.setTop({ note: undefined });
    r.push({
      point: 'pdone',
      vars: withP,
      pointers: ptrP,
      marks: focus(left, right),
      text: (f) => `p = ${f(p)}。基準値より左（${f(left)}〜${f(p - 1)}）と右（${f(p + 1)}〜${f(right)}）を、それぞれ整列すればよくなりました。`,
    });
    r.setTop({ note: (f) => `左側 ${f(left)}〜${f(p - 1)} の整列を待っています` });
    r.push({
      point: 'recL',
      vars: withP,
      pointers: ptrP,
      marks: focus(left, p - 1),
      text: (f) => `左側を整列するため、quickSort(${f(left)}, ${f(p - 1)}) を呼び出します。`,
    });
    sort(left, p - 1);
    r.setTop({ note: (f) => `右側 ${f(p + 1)}〜${f(right)} の整列を待っています` });
    r.push({
      point: 'recR',
      vars: withP,
      pointers: ptrP,
      marks: focus(p + 1, right),
      text: (f) => `右側を整列するため、quickSort(${f(p + 1)}, ${f(right)}) を呼び出します。`,
    });
    sort(p + 1, right);
    r.ret();
  };

  sort(0, n - 1);
  r.sticky = markRange(n, () => true, 'sorted');
  const [c, s] = [r.stats[CMP], r.stats[SWP]];
  r.push({
    point: null,
    text: () => `整列が終わりました。比較は ${c} 回、実際に位置が変わった交換は ${s} 回でした。`,
  });
  return r.steps;
}

export const quick: Algorithm = {
  id: 'quick',
  name: 'クイックソート',
  en: 'Quick Sort',
  category: '整列',
  level: 3,
  tagline: '基準値より小さいグループと大きいグループに分けて、くり返す',
  intro: [
    '範囲の中から基準値（pivot）を 1 つ選び、基準値以下の値を左へ、大きい値を右へ集めます（分割）。基準値はその境目に置かれ、位置が確定します。',
    '左右のグループを、それぞれまた同じ方法で（再帰で）整列します。この例では範囲の右端を基準値にしています。',
  ],
  examPoints: [
    '基準値の選び方（右端・左端・中央など）は問題によって違う。問題文のコードを確認する',
    '1 回の分割で、基準値の位置が確定する',
    '平均 O(n log n) で速いが、すでに整列済みのデータで端を基準値にすると最悪 O(n²) になる',
    '安定な整列ではない',
  ],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  input: INPUT,
  inputIsArray: true,
  datasets: sortDatasets(
    [1, 2, 6, 5, 8, 3],
    '基準値（右端）が、毎回なるべく範囲の真ん中の値になる並びです。左右に半分ずつ分かれるので、比較回数が最小になります。',
    ASCENDING,
    'すでに昇順だと、右端の基準値がいつも最大値になり、分割しても 1 つしか減りません。比較は n(n-1)/2 回になり、O(n²) です（逆順も同じ回数）。',
  ),
  trace: (input = INPUT) => traceQuick(input),
  expectedOutput: SORT_OUTPUT,
  code: { pseudo, python, js, c, cpp, java, go, rust, swift, ruby, perl },
};
