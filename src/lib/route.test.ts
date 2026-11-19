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
