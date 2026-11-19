import type { Frame, IndexFmt, Item, Mark, Pointer, Step, Var } from './types';

/**
 * アルゴリズムを実際に動かしながら、1 ステップずつ画面の状態を記録する。
 * 各アルゴリズムの trace() から使う。
 */
export class Recorder {
  items: (Item | null)[];
  held: { item: Item; over: number; mark?: Mark } | null = null;
  /** 2 段目の配列（使わないときは null） */
  aux: (Item | null)[] | null = null;
  /** コールスタック（使わないときは null） */
  frames: Frame[] | null = null;
  private nextFrameId = 0;
  private nextItemId: number;
  /** 確定済みなど、ステップをまたいで残る印 */
  sticky: Partial<Record<number, Mark>> = {};
  stats: Record<string, number> = {};
  readonly steps: Step[] = [];

  constructor(values: (number | null)[]) {
    this.items = values.map((value, id) => (value === null ? null : { id, value }));
    this.nextItemId = values.length;
  }

  /** 新しい要素（スタックに積む値、リストの新しいノードなど） */
  newItem(value: number): Item {
    return { id: this.nextItemId++, value };
  }

  /** 関数を呼び出す。呼び出し元は「待ち」になる */
  call(label: Frame['label'], value?: number): Frame {
    this.frames ??= [];
    const top = this.frames[this.frames.length - 1];
    if (top) this.frames[this.frames.length - 1] = { ...top, state: 'waiting' };
    const f: Frame = { id: this.nextFrameId++, label, value, state: 'active' };
    this.frames.push(f);
    return f;
  }

  /** いちばん上の段を書きかえる */
  setTop(patch: Partial<Frame>): void {
    if (!this.frames?.length) throw new Error('no frame');
    const i = this.frames.length - 1;
    this.frames[i] = { ...this.frames[i], ...patch };
  }

  /** いちばん上の段を取りのぞき、呼び出し元を「実行中」に戻す */
  ret(): void {
    if (!this.frames?.length) throw new Error('no frame');
    this.frames.pop();
    const i = this.frames.length - 1;
    if (i >= 0) this.frames[i] = { ...this.frames[i], state: 'active' };
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
      held: this.held ? { ...this.held } : null,
      ...(this.aux ? { aux: [...this.aux] } : {}),
      ...(this.frames ? { frames: [...this.frames] } : {}),
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
