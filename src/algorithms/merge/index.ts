import type { Algorithm, Mark, Pointer, Var } from '../types';
import { Recorder, markRange } from '../recorder';
import pseudo from './code/main.pseudo?raw';
import python from './code/main.py?raw';
import js from './code/main.js?raw';
import cpp from './code/main.cpp?raw';
import rust from './code/main.rs?raw';
import ruby from './code/main.rb?raw';
import perl from './code/main.pl?raw';

const INPUT = [6, 3, 8, 1, 5, 2];

export function traceMerge(input: number[]) {
  const r = new Recorder(input);
  const n = input.length;
  r.aux = Array(n).fill(null);
  r.frames = [];
  const CMP = '比較回数';
  r.stats[CMP] = 0;

  /** 今の範囲の外は眠らせる */
  const focus = (l: number, rr: number, extra: Partial<Record<number, Mark>> = {}) => ({
    ...markRange(n, (x) => x < l || x > rr, 'out'),
    ...extra,
  });

  const sort = (left: number, right: number) => {
    r.call((f) => `mergeSort(${f(left)}, ${f(right)})`);
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
      text: (f) => `mergeSort(${f(left)}, ${f(right)}) が呼ばれました。位置 ${f(left)}〜${f(right)} を整列します。`,
    });
    const leaf = left >= right;
    r.push({
      point: 'base',
      vars: base,
      pointers: lr,
      marks: focus(left, right),
      text: () => (leaf ? '要素が 1 つしかないので、もう整列済みです。' : '要素が 2 つ以上あるので、半分に分けます。'),
    });
    if (leaf) {
      r.setTop({ state: 'returning' });
      r.push({
        point: 'leaf',
        vars: base,
        pointers: lr,
        marks: focus(left, right),
        text: () => '何もせずに戻ります。',
      });
      r.ret();
      return;
    }
    const mid = Math.floor((left + right) / 2);
    const withMid: Var[] = [...base, { name: 'mid', value: mid, index: true }];
    r.push({
      point: 'mid',
      vars: withMid,
      pointers: [...lr, { name: 'mid', index: mid }],
      marks: focus(left, right),
      text: (f) => `mid = (${f(left)} + ${f(right)}) ÷ 2 の商 = ${f(mid)}。左半分 ${f(left)}〜${f(mid)} と右半分 ${f(mid + 1)}〜${f(right)} に分けます。`,
    });
    r.setTop({ note: (f) => `左半分 ${f(left)}〜${f(mid)} の整列を待っています` });
    r.push({
      point: 'recL',
      vars: withMid,
      pointers: [...lr, { name: 'mid', index: mid }],
      marks: focus(left, mid),
      text: (f) => `まず左半分を整列するため、mergeSort(${f(left)}, ${f(mid)}) を呼び出します。`,
    });
    sort(left, mid);
    r.setTop({ note: (f) => `右半分 ${f(mid + 1)}〜${f(right)} の整列を待っています` });
    r.push({
      point: 'recR',
      vars: withMid,
      pointers: [...lr, { name: 'mid', index: mid }],
      marks: focus(mid + 1, right),
      text: (f) => `左半分が整列できました。次に右半分を整列するため、mergeSort(${f(mid + 1)}, ${f(right)}) を呼び出します。`,
    });
    sort(mid + 1, right);
    r.setTop({ note: (f) => `${f(left)}〜${f(mid)} と ${f(mid + 1)}〜${f(right)} をマージ中` });

    // マージ
    let i = left;
    let j = mid + 1;
    let k = left;
    const vars = (): Var[] => [...withMid, { name: 'i', value: i, index: true }, { name: 'j', value: j, index: true }, { name: 'k', value: k, index: true }];
    const ptr = (): Pointer[] => [
      ...(i <= mid ? [{ name: 'i', index: i }] : []),
      ...(j <= right ? [{ name: 'j', index: j }] : []),
      { name: 'k', index: k, row: 'aux' },
    ];
    const [i0, j0, k0] = [i, j, k];
    r.push({
      point: 'mstart',
      vars: vars(),
      pointers: ptr(),
      marks: focus(left, right),
      text: (f) => `両方の半分が整列できたので、マージ（併合）します。i は左半分の先頭 ${f(i0)}、j は右半分の先頭 ${f(j0)}、k は tmp に書く位置 ${f(k0)}。`,
    });
    const take = (from: number, point: string, why: (f: (x: number) => number) => string) => {
      const item = r.items[from]!;
      r.items[from] = null;
      r.aux![k] = item;
      const kk = k;
      if (point === 'takeL' || point === 'restL') i++;
      else j++;
      k++;
      r.push({
        point,
        vars: vars(),
        pointers: ptr(),
        marks: focus(left, right),
        text: (f) => `${why(f)}${item.value} を tmp[${f(kk)}] へ。`,
      });
    };
    while (i <= mid && j <= right) {
      const a = r.value(i);
      const b = r.value(j);
      r.count(CMP);
      const left1 = a <= b;
      const [ii, jj] = [i, j];
      r.push({
        point: 'mcmp',
        vars: vars(),
        pointers: ptr(),
        marks: focus(left, right, { [ii]: 'compare', [jj]: 'compare' }),
        text: (f) => `data[${f(ii)}] = ${a} と data[${f(jj)}] = ${b} を比べます。${left1 ? `${a} ≦ ${b} なので左を取ります。` : `${a} > ${b} なので右を取ります。`}`,
      });
      if (left1) take(ii, 'takeL', () => '小さいほうの ');
      else take(jj, 'takeR', () => '小さいほうの ');
    }
    while (i <= mid) take(i, 'restL', () => '右半分を使い切ったので、左の残りをそのまま写します。');
    while (j <= right) take(j, 'restR', () => '左半分を使い切ったので、右の残りをそのまま写します。');

    for (let x = left; x <= right; x++) {
      r.items[x] = r.aux![x];
      r.aux![x] = null;
    }
    k = right + 1;
    r.push({
      point: 'copy',
      vars: vars(),
      pointers: [],
      marks: focus(left, right, markRange(n, (x) => x >= left && x <= right, 'sorted')),
      text: (f) => `tmp の ${f(left)}〜${f(right)} を data に書き戻します。この範囲が小さい順に並びました。`,
    });
    r.setTop({ state: 'returning', note: undefined });
    r.ret();
  };

  sort(0, n - 1);
  const c = r.stats[CMP];
  r.sticky = markRange(n, () => true, 'sorted');
  r.push({
    point: null,
    text: () => `整列が終わりました。比較は ${c} 回でした。`,
  });
  return r.steps;
}

export const merge: Algorithm = {
  id: 'merge',
  name: 'マージソート',
  en: 'Merge Sort',
  category: '整列',
  level: 3,
  tagline: '半分に分けて整列し、2 つの列を小さい順に合わせる',
  intro: [
    '配列を半分に分け、それぞれを（再帰で）整列してから、2 つの整列済みの列を先頭から比べて小さいほうを順に取り出し、1 つにまとめます（マージ）。',
    'まとめるときは作業用の配列 tmp を使い、最後に data へ書き戻します。下の段が tmp です。',
  ],
  examPoints: [
    '分割 → 再帰 → マージ の順番。再帰呼び出しの順（左半分が先）をトレースできるように',
    'マージでは data[i] ≦ data[j] のときに左を取る（= にすると安定な整列になる）',
    '片方を使い切ったら、もう片方の残りをそのまま写す',
    '計算量は入力によらず O(n log n)。そのかわり作業用に n 個分のメモリが要る',
  ],
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', note: '作業用の配列に O(n) のメモリを使う' },
  input: INPUT,
  inputIsArray: true,
  view: { auxLabel: 'tmp' },
  trace: () => traceMerge(INPUT),
  expectedOutput: '1 2 3 5 6 8',
  code: { pseudo, python, js, cpp, rust, ruby, perl },
};
