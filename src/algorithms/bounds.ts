/**
 * 要素数 n の整列で、比較回数・交換（ずらし）回数がとりうる最小（最良）と最大（最悪）。
 * 値がすべて異なる n 個の並べ方を考えたときの値で、bounds.test.ts で全とおりを試して確かめている。
 * 同じ値があるデータでも、実際の回数はこの範囲に入る。
 */

export type SortId = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

export interface Counts {
  compares: number;
  /** 交換回数（挿入ソートはずらし回数）。マージソートは入れかえないので null */
  swaps: number | null;
}

export interface Bounds {
  best: Counts;
  worst: Counts;
  /** 最良・最悪を決める指標。比較回数がデータによらず同じ整列は交換回数で決まる */
  metric: 'compares' | 'swaps';
}

const pairs = (n: number) => (n * (n - 1)) / 2;

/** トップダウンのマージソート（左半分が ceil(n/2) 個）の比較回数。最良は短いほうの長さ、最悪は合計 - 1 回ずつ */
function mergeCompares(n: number, kind: 'best' | 'worst'): number {
  if (n <= 1) return 0;
  const left = Math.ceil(n / 2);
  const right = n - left;
  const here = kind === 'best' ? Math.min(left, right) : n - 1;
  return here + mergeCompares(left, kind) + mergeCompares(right, kind);
}

/** 右端を基準値にするクイックソート（Lomuto）の最小の比較回数。基準値の順位 k をうまく選べた場合 */
function quickBest(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return 0;
  const hit = memo.get(n);
  if (hit !== undefined) return hit;
  let best = Infinity;
  for (let k = 0; k < n; k++) best = Math.min(best, quickBest(k, memo) + quickBest(n - 1 - k, memo));
  const v = n - 1 + best;
  memo.set(n, v);
  return v;
}

export function sortBounds(id: SortId, n: number): Bounds {
  const c = pairs(n);
  switch (id) {
    case 'bubble':
      return { metric: 'swaps', best: { compares: c, swaps: 0 }, worst: { compares: c, swaps: c } };
    case 'selection':
      return { metric: 'swaps', best: { compares: c, swaps: 0 }, worst: { compares: c, swaps: Math.max(0, n - 1) } };
    case 'insertion':
      return { metric: 'compares', best: { compares: Math.max(0, n - 1), swaps: 0 }, worst: { compares: c, swaps: c } };
    case 'merge':
      return { metric: 'compares', best: { compares: mergeCompares(n, 'best'), swaps: null }, worst: { compares: mergeCompares(n, 'worst'), swaps: null } };
    case 'quick':
      return { metric: 'compares', best: { compares: quickBest(n), swaps: null }, worst: { compares: c, swaps: null } };
  }
}

/** このデータの回数が、最良〜最悪のどのあたりか */
export function position(value: number, best: number, worst: number): string {
  if (best === worst) return 'データによらず同じ';
  if (value <= best) return '最良と同じ';
  if (value >= worst) return '最悪と同じ';
  const r = (value - best) / (worst - best);
  return r < 1 / 3 ? '最良寄り' : r > 2 / 3 ? '最悪寄り' : '中くらい';
}
