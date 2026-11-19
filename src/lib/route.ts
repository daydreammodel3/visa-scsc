import { algorithms } from '../algorithms';
import type { DatasetId } from '../algorithms/types';

export interface Route {
  algorithmId: string;
  step: number;
  /** 入力データの種類（整列のみ。標準以外のときだけ URL に入れる） */
  dataset: DatasetId;
  /** 比較表示のときの、左右の整列アルゴリズム */
  compare?: [string, string];
}

/** 比較表示で選べるアルゴリズム（整列） */
export const compareChoices = () => algorithms.filter((a) => a.category === '整列');
export const DEFAULT_COMPARE: [string, string] = ['bubble', 'quick'];

/**
 * "#/bubble/3"、"#/bubble/3/worst"、比較表示は "#/compare/bubble/quick/3" を読む。
 * ステップ数の上限は呼び出し側で丸める
 */
export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#/, '').split('/');
  const step = (s: string | undefined) => {
    const n = Number.parseInt(s ?? '0', 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  if (parts[1] === 'compare') {
    const ok = (id: string | undefined, fallback: string) => compareChoices().find((a) => a.id === id)?.id ?? fallback;
    const a = ok(parts[2], DEFAULT_COMPARE[0]);
    const b = ok(parts[3], DEFAULT_COMPARE[1]);
    return { algorithmId: a, step: step(parts[4]), dataset: 'standard', compare: [a, b] };
  }
  const [, id, s, d] = parts;
  const algo = algorithms.find((x) => x.id === id) ?? algorithms[0];
  const dataset = algo.datasets?.find((x) => x.id === d)?.id ?? 'standard';
  return { algorithmId: algo.id, step: step(s), dataset };
}

export function toHash(r: Route): string {
  if (r.compare) return `#/compare/${r.compare[0]}/${r.compare[1]}/${r.step}`;
  return `#/${r.algorithmId}/${r.step}${r.dataset === 'standard' ? '' : `/${r.dataset}`}`;
}
