import { useMemo } from 'react';
import { findAlgorithm } from '../algorithms';
import type { Algorithm, IndexFmt } from '../algorithms/types';
import { compareChoices } from '../lib/route';
import { comparisonIndices, introStepOf, valueRange } from '../lib/steps';
import { ArrayStage, measureLayout } from './ArrayStage';
import { CallStack } from './CallStack';
import { SortCompare } from './SortCompare';

interface Props {
  ids: [string, string];
  /** 整列するデータ（標準か任意） */
  input: number[];
  step: number;
  fmt: IndexFmt;
  travelMs: number;
  onPick: (side: 0 | 1, id: string) => void;
}

/**
 * 2 つの整列を同じデータで並べて動かす。
 * 1 ステップ = 比較 1 回。比較と比較のあいだの入れかえ・移動は、次の比較へ進むときにまとめて動く。
 */
export function CompareView({ ids, input, step, fmt, travelMs, onPick }: Props) {
  const choices = compareChoices();
  return (
    <div className="compare">
      <div className="compare-lanes">
        {ids.map((id, side) => (
          <Lane
            key={side}
            algo={findAlgorithm(id)!}
            input={input}
            step={step}
            fmt={fmt}
            travelMs={travelMs}
            choices={choices}
            onPick={(next) => onPick(side as 0 | 1, next)}
          />
        ))}
      </div>
      <SortCompare sorts={choices} highlight={ids} input={input} />
    </div>
  );
}

function Lane({
  algo,
  input,
  step,
  fmt,
  travelMs,
  choices,
  onPick,
}: {
  algo: Algorithm;
  input: number[];
  step: number;
  fmt: IndexFmt;
  travelMs: number;
  choices: Algorithm[];
  onPick: (id: string) => void;
}) {
  const steps = useMemo(() => algo.trace(input), [algo, input]);
  const layout = useMemo(() => measureLayout(steps), [steps]);
  const range = useMemo(() => valueRange(steps), [steps]);
  const hasFrames = useMemo(() => steps.some((s) => s.frames), [steps]);
  const cmp = useMemo(() => comparisonIndices(steps), [steps]);
  // 0 = 紹介、1〜比較回数 = その回の比較、それより後 = 整列が終わった状態
  const s = step <= 0 ? introStepOf(algo, steps) : step <= cmp.length ? steps[cmp[step - 1]] : steps[steps.length - 1];
  const done = step > cmp.length;
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
              比較 <b>{step}</b> / {cmp.length}
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
