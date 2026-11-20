import { useMemo } from 'react';
import type { Algorithm, Dataset, DatasetId, LangId, Step } from '../algorithms/types';
import type { SortId } from '../algorithms/bounds';
import { SORT_INPUT } from '../algorithms/sortInput';
import { introStepOf, valueRange } from '../lib/steps';
import { ArrayStage, measureLayout } from './ArrayStage';
import { CallStack } from './CallStack';
import { CodeView } from './CodeView';
import { CustomBounds } from './CustomBounds';
import { Intro } from './Intro';
import { NumBuddy } from './NumBuddy';
import { VarPanel } from './VarPanel';

interface Props {
  algo: Algorithm;
  steps: Step[];
  /** 0 = 説明, 1..total = ステップ */
  current: number;
  total: number;
  input: number[];
  datasetId: DatasetId;
  dataset?: Dataset;
  custom?: number[];
  lang: LangId;
  onLang: (lang: LangId) => void;
  fmt: (i: number) => number;
  travelMs: number;
}

/** 1 つのアルゴリズムの画面: データのようす・説明と変数・コード */
export function AlgorithmStage({ algo, steps, current, total, input, datasetId, dataset, custom, lang, onLang, fmt, travelMs }: Props) {
  const introStep = useMemo(() => introStepOf(algo, steps), [algo, steps]);
  const step = current === 0 ? introStep : steps[current - 1];
  const prevStep = current <= 1 ? undefined : steps[current - 2];

  const range = useMemo(() => valueRange(steps), [steps]);
  const layout = useMemo(() => measureLayout(steps), [steps]);
  const hasFrames = useMemo(() => steps.some((s) => s.frames), [steps]);
  const view = algo.view ?? {};

  return (
    <main className="stage">
      <section className={hasFrames ? 'panel panel-array with-stack' : 'panel panel-array'} aria-label="データのようす">
        {layout.slots > 0 && (
          <div className="stage-wrap">
            <ArrayStage
              step={step}
              layout={layout}
              view={view}
              range={range}
              fmt={fmt}
              travelMs={travelMs}
              label={`${view.label ?? 'data'}: ${step.items.map((it) => it?.value ?? '空き').join(', ')}`}
            />
          </div>
        )}
        {hasFrames && <CallStack frames={step.frames ?? []} fmt={fmt} range={range} buddies={layout.slots === 0} />}
      </section>

      <section className="panel panel-explain" aria-live="polite">
        {current === 0 ? (
          <Intro algo={algo} dataset={dataset} />
        ) : (
          <div className="explain" key={current}>
            <div className="bubble-row">
              <NumBuddy size={56} value={null} color="#ffd43b" guide />
              <p className="bubble">
                <span className="bubble-step">
                  {current} / {total}
                </span>
                {step.text(fmt)}
              </p>
            </div>
          </div>
        )}
        <VarPanel step={step} prev={prevStep} fmt={fmt} />
        {custom && <CustomBounds algoId={algo.id as SortId} input={custom} last={steps[steps.length - 1]} />}
      </section>

      <section className="panel panel-code" aria-label="コード">
        <CodeView
          code={algo.code}
          lang={lang}
          onLang={onLang}
          point={step.point}
          // 標準以外のデータでは、コードの中の配列もそのデータに書き換えて見せる
          replace={algo.datasets && datasetId !== 'standard' ? [SORT_INPUT.join(', '), input.join(', ')] : undefined}
        />
      </section>
    </main>
  );
}
