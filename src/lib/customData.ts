/** 任意データの入力の決まり */
export const CUSTOM_MIN_COUNT = 2;
export const CUSTOM_MAX_COUNT = 10;
export const CUSTOM_MIN_VALUE = 0;
export const CUSTOM_MAX_VALUE = 99;

export type ParseResult = { ok: true; values: number[] } | { ok: false; error: string };

/** "9, 4, 7, 1" → [9, 4, 7, 1]。全角数字・読点・空白区切りも受けつける */
export function parseCustom(text: string): ParseResult {
  const normalized = text.replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0));
  const parts = normalized
    .split(/[,、，\s]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '');
  if (parts.length === 0) return { ok: false, error: '数をカンマ区切りで入力してください（例: 9, 4, 7, 1）' };
  const bad = parts.find((s) => !/^\d+$/.test(s));
  if (bad !== undefined) return { ok: false, error: `「${bad}」は使えません。${CUSTOM_MIN_VALUE}〜${CUSTOM_MAX_VALUE} の整数だけを入力してください` };
  const values = parts.map(Number);
  const out = values.find((v) => v < CUSTOM_MIN_VALUE || v > CUSTOM_MAX_VALUE);
  if (out !== undefined) return { ok: false, error: `${out} は範囲外です。${CUSTOM_MIN_VALUE}〜${CUSTOM_MAX_VALUE} の整数にしてください` };
  if (values.length < CUSTOM_MIN_COUNT || values.length > CUSTOM_MAX_COUNT)
    return { ok: false, error: `${CUSTOM_MIN_COUNT}〜${CUSTOM_MAX_COUNT} 個で入力してください（いまは ${values.length} 個）` };
  return { ok: true, values };
}

/** URL に入れる形 "9,4,7,1" */
export const encodeCustom = (values: number[]) => values.join(',');

export function decodeCustom(s: string | undefined): number[] | undefined {
  if (!s) return undefined;
  const r = parseCustom(decodeURIComponent(s));
  return r.ok ? r.values : undefined;
}
