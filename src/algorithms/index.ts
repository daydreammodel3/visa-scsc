import type { Algorithm } from './types';
import { linear } from './linear';
import { binary } from './binary';
import { bubble } from './bubble';
import { selection } from './selection';
import { insertion } from './insertion';

export interface Category {
  name: string;
  items: Algorithm[];
}

/** 左メニューの並び。アルゴリズムを足すときはここに追加する */
export const categories: Category[] = [
  { name: '探索', items: [linear, binary] },
  { name: '整列', items: [bubble, selection, insertion] },
];

export const algorithms: Algorithm[] = categories.flatMap((c) => c.items);

export function findAlgorithm(id: string): Algorithm | undefined {
  return algorithms.find((a) => a.id === id);
}
