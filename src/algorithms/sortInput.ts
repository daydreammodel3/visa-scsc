import type { Dataset, DatasetId } from './types';

/**
 * 整列アルゴリズムで共通に使う入力。
 * すべての整列で同じデータを使うので、ステップ数や比較回数をそのまま比べられる。
 * 変えるときは、各整列の code/ にあるサンプルの配列も同じ値にする（テストで確かめる）。
 */
export const SORT_INPUT = [5, 3, 8, 1, 6, 2];

/** サンプルコードの出力（昇順に並べて空白区切り） */
export const SORT_OUTPUT = [...SORT_INPUT].sort((a, b) => a - b).join(' ');

export const ASCENDING = [...SORT_INPUT].sort((a, b) => a - b);
export const DESCENDING = [...ASCENDING].reverse();

export const DATASET_LABEL: Record<DatasetId, string> = {
  standard: '標準',
  best: '最良',
  worst: '最悪',
  custom: '任意',
};

/**
 * 標準・最良・最悪の 3 つのデータ。最良・最悪は SORT_INPUT の並べかえで、
 * 720 とおりの並べ方をすべて試して、比較回数（同じなら交換回数）が最小・最大になるものから選んでいる（テストで確かめる）。
 */
export function sortDatasets(best: number[], bestNote: string, worst: number[], worstNote: string): Dataset[] {
  return [
    { id: 'standard', input: SORT_INPUT, note: 'すべての整列で共通のデータです。ほかの整列とステップ数や比較回数を比べられます。' },
    { id: 'best', input: best, note: bestNote },
    { id: 'worst', input: worst, note: worstNote },
  ];
}
