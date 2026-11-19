import { algorithms } from '../algorithms';

export interface Route {
  algorithmId: string;
  step: number;
}

/** "#/bubble/3" → { algorithmId: 'bubble', step: 3 }。ステップ数の上限は呼び出し側で丸める */
export function parseHash(hash: string): Route {
  const [, id, s] = hash.replace(/^#/, '').split('/');
  const algo = algorithms.find((a) => a.id === id) ?? algorithms[0];
  const n = Number.parseInt(s ?? '0', 10);
  return { algorithmId: algo.id, step: Number.isFinite(n) && n > 0 ? n : 0 };
}

export function toHash(r: Route): string {
  return `#/${r.algorithmId}/${r.step}`;
}
