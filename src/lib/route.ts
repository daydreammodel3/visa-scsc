import { algorithms } from '../algorithms';
import type { DatasetId } from '../algorithms/types';

export interface Route {
  algorithmId: string;
  step: number;
  /** 入力データの種類（整列のみ。標準以外のときだけ URL に入れる） */
  dataset: DatasetId;
}

/** "#/bubble/3" や "#/bubble/3/worst" を読む。ステップ数の上限は呼び出し側で丸める */
export function parseHash(hash: string): Route {
  const [, id, s, d] = hash.replace(/^#/, '').split('/');
  const algo = algorithms.find((a) => a.id === id) ?? algorithms[0];
  const n = Number.parseInt(s ?? '0', 10);
  const dataset = algo.datasets?.find((x) => x.id === d)?.id ?? 'standard';
  return { algorithmId: algo.id, step: Number.isFinite(n) && n > 0 ? n : 0, dataset };
}

export function toHash(r: Route): string {
  return `#/${r.algorithmId}/${r.step}${r.dataset === 'standard' ? '' : `/${r.dataset}`}`;
}
