import { useMemo } from 'react';
import { findAlgorithm } from '../algorithms';
import type { Algorithm, IndexFmt } from '../algorithms/types';
import { compareChoices } from '../lib/route';
import { stepAt, valueRange } from '../lib/steps';
import { ArrayStage, measureLayout } from './ArrayStage';
import { CallStack } from './CallStack';
import { SortCompare } from './SortCompare';

interface Props {
  ids: [string, string];
  step: number;
  fmt: IndexFmt;
  travelMs: number;
  onPick: (side: 0 | 1, id: string) => void;
}

/** 2 つの整列を、同じデータ・同じステップ数で並べて動かす */
export function CompareView({ ids, step, fmt, travelMs, onPick }: Props) {
  const choices = compareChoices();
  return (
    <div className="compare">
      <div className="compare-lanes">
        {ids.map((id, side) => (
          <Lane
            key={side}
            algo={findAlgorithm(id)!}
            step={step}
            fmt={fmt}
            travelMs={travelMs}
            choices={choices}
            onPick={(next) => onPick(side as 0 | 1, next)}
          />
        ))}
      </div>
      <SortCompare sorts={choices} highlight={ids} />
    </div>
  );
}

function Lane({
  algo,
  step,
  fmt,
  travelMs,
  choices,
  onPick,
}: {
  algo: Algorithm;
  step: number;
  fmt: IndexFmt;
  travelMs: number;
  choices: Algorithm[];
  onPick: (id: string) => void;
}) {
  const steps = useMemo(() => algo.trace(), [algo]);
  const layout = useMemo(() => measureLayout(steps), [steps]);
  const range = useMemo(() => valueRange(steps), [steps]);
  const hasFrames = useMemo(() => steps.some((s) => s.frames), [steps]);
  const s = stepAt(algo, steps, step);
  const done = step >= steps.length;
  // カウンタの種類は最後のステップから決め、値はいまのステップのもの（紹介では 0）
  const labels = steps[steps.length - 1].stats.map((x) => x.label);
  const now = new Map(s.stats.map((x) => [x.label, x.value]));
  return (
    <section className={done ? 'panel lane lane-done' : 'panel lane'} aria-label={algo.name}>
      <header className="lane-head">
        <select value={algo.id} onChange={(e) => onPick(e.target.value)} aria-label="比べるアルゴリズム">
          {choices.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="lane-progress">
          {done ? (
            <b className="lane-badge">完了！</b>
          ) : (
            <>
              <b>{Math.min(step, steps.length)}</b> / {steps.length}
            </>
          )}
        </span>
      </header>
      <div className="lane-stage">
        <ArrayStage
          step={s}
          layout={layout}
          view={algo.view ?? {}}
          range={range}
          fmt={fmt}
          travelMs={travelMs}
          label={`${algo.name}: ${s.items.map((it) => it?.value ?? '空き').join(', ')}`}
        />
      </div>
      {hasFrames && <CallStack frames={s.frames ?? []} fmt={fmt} range={range} buddies={false} />}
      <p className="lane-text">{step === 0 ? '「進む」で 2 つ同時にスタート' : s.text(fmt)}</p>
      <dl className="stat-list lane-stats">
        {labels.map((l) => (
          <div className="stat" key={l}>
            <dt>{l}</dt>
            <dd>{now.get(l) ?? 0}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
