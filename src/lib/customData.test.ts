import { describe, expect, it } from 'vitest';
import { decodeCustom, encodeCustom, parseCustom } from './customData';

describe('parseCustom', () => {
  it('カンマ・読点・空白・全角数字を受けつける', () => {
    expect(parseCustom('9, 4, 7, 1')).toEqual({ ok: true, values: [9, 4, 7, 1] });
    expect(parseCustom('9、4，7 1')).toEqual({ ok: true, values: [9, 4, 7, 1] });
    expect(parseCustom(' ９,４ ')).toEqual({ ok: true, values: [9, 4] });
    expect(parseCustom('0,99,0')).toEqual({ ok: true, values: [0, 99, 0] });
  });
  it('決まりに合わないものはエラー', () => {
    for (const bad of ['', '  ,  ', '1', '1,2,3,4,5,6,7,8,9,10,11', '1,a', '1,-2', '1,2.5', '1,100']) {
      expect(parseCustom(bad).ok, bad).toBe(false);
    }
  });
  it('URL との往復', () => {
    expect(decodeCustom(encodeCustom([9, 4, 7, 1]))).toEqual([9, 4, 7, 1]);
    expect(decodeCustom('1,999')).toBeUndefined();
    expect(decodeCustom(undefined)).toBeUndefined();
  });
});
