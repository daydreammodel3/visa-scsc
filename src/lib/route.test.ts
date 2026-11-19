import { describe, expect, it } from 'vitest';
import { parseHash, toHash } from './route';

describe('route', () => {
  it('往復できる', () => {
    for (const r of [
      { algorithmId: 'bubble', step: 4, dataset: 'standard' as const },
      { algorithmId: 'quick', step: 12, dataset: 'worst' as const },
      { algorithmId: 'insertion', step: 0, dataset: 'best' as const },
    ]) {
      expect(parseHash(toHash(r))).toEqual(r);
    }
    expect(toHash({ algorithmId: 'bubble', step: 4, dataset: 'standard' })).toBe('#/bubble/4');
  });
  it('知らない ID や壊れた値は先頭のアルゴリズムの 0 ステップ目', () => {
    expect(parseHash('#/nope/x')).toEqual({ algorithmId: 'linear', step: 0, dataset: 'standard' });
    expect(parseHash('')).toEqual({ algorithmId: 'linear', step: 0, dataset: 'standard' });
    expect(parseHash('#/binary/-3')).toEqual({ algorithmId: 'binary', step: 0, dataset: 'standard' });
  });
  it('データを選べないアルゴリズムや知らないデータ名は標準', () => {
    expect(parseHash('#/stack/2/worst').dataset).toBe('standard');
    expect(parseHash('#/bubble/2/nope').dataset).toBe('standard');
  });
});

describe('比較表示の route', () => {
  it('往復できる', () => {
    const r = { algorithmId: 'merge', step: 7, dataset: 'standard' as const, compare: ['merge', 'insertion'] as [string, string] };
    expect(toHash(r)).toBe('#/compare/merge/insertion/7');
    expect(parseHash(toHash(r))).toEqual(r);
  });
  it('整列以外や知らない ID は既定の組み合わせ', () => {
    expect(parseHash('#/compare/stack/nope').compare).toEqual(['bubble', 'quick']);
    expect(parseHash('#/compare').compare).toEqual(['bubble', 'quick']);
  });
});

describe('任意データの route', () => {
  it('往復できる', () => {
    const a = { algorithmId: 'bubble', step: 3, dataset: 'custom' as const, custom: [9, 4, 7, 1] };
    expect(toHash(a)).toBe('#/bubble/3/custom/9,4,7,1');
    expect(parseHash(toHash(a))).toEqual(a);
    const b = { algorithmId: 'merge', step: 2, dataset: 'custom' as const, custom: [3, 1], compare: ['merge', 'quick'] as [string, string] };
    expect(toHash(b)).toBe('#/compare/merge/quick/2/3,1');
    expect(parseHash(toHash(b))).toEqual(b);
  });
  it('壊れた任意データや、整列以外では標準に戻る', () => {
    expect(parseHash('#/bubble/0/custom/1,abc').dataset).toBe('standard');
    expect(parseHash('#/bubble/0/custom/5').dataset).toBe('standard');
    expect(parseHash('#/stack/0/custom/1,2').dataset).toBe('standard');
    expect(parseHash('#/compare/bubble/quick/0/1,999').dataset).toBe('standard');
  });
});
