import type { IndexFmt, Item, Mark, Pointer, Step, Var } from './types';

/**
 * アルゴリズムを実際に動かしながら、1 ステップずつ画面の状態を記録する。
 * 各アルゴリズムの trace() から使う。
 */
export class Recorder {
  items: (Item | null)[];
  held: { item: Item; over: number } | null = null;
  /** 確定済みなど、ステップをまたいで残る印 */
  sticky: Partial<Record<number, Mark>> = {};
  stats: Record<string, number> = {};
  readonly steps: Step[] = [];

  constructor(values: number[]) {
    this.items = values.map((value, id) => ({ id, value }));
  }

  value(i: number): number {
    const it = this.items[i];
    if (!it) throw new Error(`items[${i}] is empty`);
    return it.value;
  }

  count(label: string, by = 1): void {
    this.stats[label] = (this.stats[label] ?? 0) + by;
  }

  swap(a: number, b: number): void {
    [this.items[a], this.items[b]] = [this.items[b], this.items[a]];
  }

  push(s: {
    point: string | null;
    text: (f: IndexFmt) => string;
    marks?: Partial<Record<number, Mark>>;
    pointers?: Pointer[];
    vars?: Var[];
  }): void {
    this.steps.push({
      point: s.point,
      items: [...this.items],
      held: this.held ? { item: this.held.item, over: this.held.over } : null,
      marks: { ...this.sticky, ...s.marks },
      pointers: s.pointers ?? [],
      vars: s.vars ?? [],
      stats: Object.entries(this.stats).map(([label, value]) => ({ label, value })),
      text: s.text,
    });
  }
}

/** 0..n-1 のうち条件を満たす位置に同じ印を付ける */
export function markRange(n: number, pred: (i: number) => boolean, mark: Mark): Partial<Record<number, Mark>> {
  const m: Partial<Record<number, Mark>> = {};
  for (let i = 0; i < n; i++) if (pred(i)) m[i] = mark;
  return m;
}
