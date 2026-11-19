import { describe, expect, it } from 'vitest';
import { parseHash, toHash } from './route';

describe('route', () => {
  it('往復できる', () => {
    expect(parseHash(toHash({ algorithmId: 'bubble', step: 4 }))).toEqual({ algorithmId: 'bubble', step: 4 });
  });
  it('知らない ID や壊れた値は先頭のアルゴリズムの 0 ステップ目', () => {
    expect(parseHash('#/nope/x')).toEqual({ algorithmId: 'linear', step: 0 });
    expect(parseHash('')).toEqual({ algorithmId: 'linear', step: 0 });
    expect(parseHash('#/binary/-3')).toEqual({ algorithmId: 'binary', step: 0 });
  });
});
