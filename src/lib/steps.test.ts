import { describe, expect, it } from 'vitest';
import { algorithms } from '../algorithms';
import { COMPARE_LABEL, comparisonIndices } from './steps';

describe('comparisonIndices', () => {
  it.each(algorithms.filter((a) => a.category === '整列').map((a) => [a.id, a] as const))(
    '%s：比較 1 回ごとに 1 つ、比較している瞬間のステップを指す',
    (_id, a) => {
      for (const d of a.datasets ?? []) {
        const steps = a.trace(d.input);
        const idx = comparisonIndices(steps);
        const total = steps[steps.length - 1].stats.find((s) => s.label === COMPARE_LABEL)!.value;
        expect(idx).toHaveLength(total);
        idx.forEach((i, k) => {
          expect(steps[i].stats.find((s) => s.label === COMPARE_LABEL)!.value).toBe(k + 1);
          // 比べている 2 つ（または基準値と比べる 1 つ）に印が付いている
          expect(Object.values(steps[i].marks)).toContain('compare');
        });
      }
    },
  );
});
