import type { Algorithm, Step } from '../algorithms/types';

/** 0 ステップ目（紹介）は、最初のステップから印・矢印・呼び出しを除いた状態 */
export function introStepOf(algo: Algorithm, steps: Step[]): Step {
  return {
    point: null,
    items: steps[0].items,
    ...(steps[0].aux ? { aux: steps[0].aux.map(() => null) } : {}),
    ...(steps[0].frames ? { frames: [] } : {}),
    held: null,
    marks: {},
    pointers: [],
    vars: algo.target === undefined ? [] : [{ name: 'target', value: algo.target }],
    stats: [],
    text: () => '',
  };
}

/** キャラの色は、その画面に出てくる値の範囲で決める */
export function valueRange(steps: Step[]): [number, number] {
  const vs = steps.flatMap((s) => [
    ...[...s.items, ...(s.aux ?? []), s.held?.item ?? null].filter((x) => x !== null).map((x) => x!.value),
    ...(s.frames ?? []).flatMap((f) => (f.value === undefined ? [] : [f.value])),
  ]);
  return vs.length ? [Math.min(...vs), Math.max(...vs)] : [0, 1];
}

/** k 番目に表示するステップ（0 は紹介。最後を過ぎたら最後のまま） */
export function stepAt(algo: Algorithm, steps: Step[], k: number): Step {
  return k <= 0 ? introStepOf(algo, steps) : steps[Math.min(k, steps.length) - 1];
}

export const COMPARE_LABEL = '比較回数';

/** 比較回数が 1 増えたステップ（比較している瞬間）の位置。ソートの比較表示では、これを 1 ステップとして進める */
export function comparisonIndices(steps: Step[]): number[] {
  const out: number[] = [];
  let before = 0;
  steps.forEach((s, i) => {
    const now = s.stats.find((x) => x.label === COMPARE_LABEL)?.value ?? 0;
    if (now > before) out.push(i);
    before = now;
  });
  return out;
}
