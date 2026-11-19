import { describe, expect, it } from 'vitest';
import { findAlgorithm } from '.';
import { position, sortBounds, type SortId } from './bounds';

const perms = (a: number[]): number[][] =>
  a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));

function counts(id: SortId, input: number[]) {
  const steps = findAlgorithm(id)!.trace(input);
  const st = new Map(steps[steps.length - 1].stats.map((s) => [s.label, s.value]));
  return { compares: st.get('比較回数')!, swaps: st.get('交換回数') ?? st.get('移動回数') ?? null };
}

const IDS: SortId[] = ['bubble', 'selection', 'insertion', 'merge', 'quick'];

// n 個の異なる値の並べ方をすべて試して、表示する最良・最悪の値が本当に最小・最大かを確かめる
describe.each(IDS)('%s の最良・最悪（全とおりで確認）', (id) => {
  it.each([2, 3, 4, 5, 6, 7])('n = %i', (n) => {
    const all = perms(Array.from({ length: n }, (_, i) => i + 1)).map((p) => counts(id, p));
    const b = sortBounds(id, n);
    const cs = all.map((c) => c.compares);
    expect(b.best.compares).toBe(Math.min(...cs));
    expect(b.worst.compares).toBe(Math.max(...cs));
    if (b.best.swaps !== null) {
      const ws = all.map((c) => c.swaps!);
      expect(b.best.swaps).toBe(Math.min(...ws));
      expect(b.worst.swaps).toBe(Math.max(...ws));
    }
  });
});

describe('同じ値があっても範囲に入る', () => {
  const samples = [
    [1, 1],
    [3, 3, 3, 3],
    [2, 1, 2, 1, 2],
    [9, 9, 0, 0, 5, 5, 1],
    [0, 99, 50, 50, 7, 7, 7, 99, 0, 1],
  ];
  it.each(IDS)('%s', (id) => {
    for (const s of samples) {
      const b = sortBounds(id, s.length);
      const c = counts(id, s);
      expect(c.compares).toBeGreaterThanOrEqual(b.best.compares);
      expect(c.compares).toBeLessThanOrEqual(b.worst.compares);
      if (b.best.swaps !== null) {
        expect(c.swaps!).toBeGreaterThanOrEqual(b.best.swaps);
        expect(c.swaps!).toBeLessThanOrEqual(b.worst.swaps!);
      }
    }
  });
});

describe('position', () => {
  it('範囲のどこか', () => {
    expect(position(5, 5, 5)).toBe('データによらず同じ');
    expect(position(0, 0, 15)).toBe('最良と同じ');
    expect(position(15, 0, 15)).toBe('最悪と同じ');
    expect(position(2, 0, 15)).toBe('最良寄り');
    expect(position(7, 0, 15)).toBe('中くらい');
    expect(position(13, 0, 15)).toBe('最悪寄り');
  });
});
