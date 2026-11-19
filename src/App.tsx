import { useCallback, useEffect, useMemo, useState } from 'react';
import { algorithms, categories, findAlgorithm } from './algorithms';
import type { Algorithm, Dataset, DatasetId, LangId, Step } from './algorithms/types';
import { DATASET_LABEL, SORT_INPUT } from './algorithms/sortInput';
import { ArrayStage, measureLayout } from './components/ArrayStage';
import { CallStack } from './components/CallStack';
import { SortCompare } from './components/SortCompare';
import { CodeView } from './components/CodeView';
import { NumBuddy } from './components/NumBuddy';
import { SideNav } from './components/SideNav';
import { SPEEDS, StepControls, type Speed } from './components/StepControls';
import { VarPanel } from './components/VarPanel';
import { findLang } from './lib/code';
import { parseHash, toHash } from './lib/route';
import { load, save } from './lib/storage';
import { LEVEL_LABEL, UI } from './lib/text';
import { useMediaQuery } from './lib/useMediaQuery';

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>('normal');
  const [lang, setLang] = useState<LangId>(() => findLang(load('lang'))?.id ?? 'pseudo');
  const narrow = useMediaQuery('(max-width: 900px)');
  const [navPref, setNavPref] = useState(() => load('nav') !== 'closed');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navOpen = narrow ? drawerOpen : navPref;
  const toggleNav = () => {
    if (narrow) setDrawerOpen((o) => !o);
    else
      setNavPref((o) => {
        save('nav', o ? 'closed' : 'open');
        return !o;
      });
  };

  const algo = findAlgorithm(route.algorithmId) ?? algorithms[0];
  const dataset = algo.datasets?.find((d) => d.id === route.dataset);
  const input = dataset?.input ?? algo.input;
  const steps = useMemo(() => algo.trace(input), [algo, input]);
  const total = steps.length;
  const current = Math.min(route.step, total);

  // 0 ステップ目（紹介）は、最初のステップから印・矢印・呼び出しを除いた状態
  const introStep = useMemo<Step>(
    () => ({
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
    }),
    [algo, steps],
  );
  const step = current === 0 ? introStep : steps[current - 1];
  const prevStep = current <= 1 ? undefined : steps[current - 2];

  const base = findLang(lang)?.base ?? 0;
  const fmt = useCallback((i: number) => i + base, [base]);
  // キャラの色は、その画面に出てくる値の範囲で決める
  const range = useMemo<[number, number]>(() => {
    const vs = steps.flatMap((s) => [
      ...[...s.items, ...(s.aux ?? []), s.held?.item ?? null].filter((x) => x !== null).map((x) => x!.value),
      ...(s.frames ?? []).flatMap((f) => (f.value === undefined ? [] : [f.value])),
    ]);
    return vs.length ? [Math.min(...vs), Math.max(...vs)] : [0, 1];
  }, [steps]);
  const layout = useMemo(() => measureLayout(steps), [steps]);
  const hasFrames = useMemo(() => steps.some((s) => s.frames), [steps]);
  const view = algo.view ?? {};

  useEffect(() => save('lang', lang), [lang]);

  // URL のハッシュと同期（共有・ブラウザの戻る に対応）
  useEffect(() => {
    const next = toHash({ algorithmId: algo.id, step: current, dataset: dataset?.id ?? 'standard' });
    if (window.location.hash !== next) window.history.replaceState(null, '', next);
  }, [algo.id, current, dataset?.id]);
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goTo = useCallback(
    (n: number) => setRoute((r) => ({ ...r, step: Math.min(Math.max(n, 0), total) })),
    [total],
  );

  /** 整列どうしで移るときは、選んでいるデータの種類（最良・最悪）を引き継ぐ */
  const select = (id: string) => {
    setPlaying(false);
    const next = findAlgorithm(id);
    setRoute((r) => ({ algorithmId: id, step: 0, dataset: next?.datasets?.some((d) => d.id === r.dataset) ? r.dataset : 'standard' }));
    if (narrow) setDrawerOpen(false);
  };

  const selectDataset = (d: DatasetId) => {
    setPlaying(false);
    setRoute((r) => ({ ...r, dataset: d, step: 0 }));
  };

  useEffect(() => {
    if (!(narrow && drawerOpen)) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [narrow, drawerOpen]);

  const togglePlay = useCallback(() => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (current >= total) goTo(0);
    setPlaying(true);
  }, [playing, current, total, goTo]);

  // 自動再生
  useEffect(() => {
    if (!playing) return;
    if (current >= total) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => goTo(current + 1), current === 0 ? 300 : SPEEDS[speed].interval);
    return () => window.clearTimeout(id);
  }, [playing, current, total, speed, goTo]);

  // キーボード操作
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (narrow && drawerOpen) return;
      if (e.key === 'ArrowRight') {
        setPlaying(false);
        goTo(current + 1);
      } else if (e.key === 'ArrowLeft') {
        setPlaying(false);
        goTo(current - 1);
      } else if (e.key === 'Home') {
        setPlaying(false);
        goTo(0);
      } else if (e.key === 'End') {
        setPlaying(false);
        goTo(total);
      } else if (e.key === ' ' && target?.tagName !== 'BUTTON' && target?.getAttribute('role') !== 'button') {
        e.preventDefault();
        togglePlay();
      } else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, total, goTo, togglePlay, narrow, drawerOpen]);

  const travelMs = SPEEDS[speed].travel;

  return (
    <div className="app">
      <header className="top">
        <button
          type="button"
          className={navOpen ? 'hamburger open' : 'hamburger'}
          aria-expanded={navOpen}
          aria-controls="sidenav"
          aria-label={navOpen ? UI.closeMenu : UI.openMenu}
          title={navOpen ? UI.closeMenu : UI.openMenu}
          onClick={toggleNav}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="brand">
          <NumBuddy size={52} value={null} color="#ffd43b" guide />
          <div>
            <h1>{UI.title}</h1>
            <p>{UI.subtitle}</p>
          </div>
        </div>
      </header>

      <div className={navOpen ? 'shell nav-open' : 'shell'}>
        {navOpen && (
          <SideNav
            id="sidenav"
            categories={categories}
            currentId={algo.id}
            label={UI.pickAlgorithm}
            onSelect={select}
            onClose={narrow ? () => setDrawerOpen(false) : undefined}
            closeLabel={UI.closeMenu}
          />
        )}
        {narrow && drawerOpen && <div className="backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

        <div className="content">
          <div className="algo-head">
            <h2>
              {algo.name}
              <small>{algo.en}</small>
            </h2>
            <span className={`nav-level lv${algo.level}`}>{LEVEL_LABEL[algo.level]}</span>
            <p>{algo.tagline}</p>
            {algo.datasets && <DataPicker datasets={algo.datasets} current={dataset?.id ?? 'standard'} onSelect={selectDataset} />}
          </div>

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
                <Intro algo={algo} dataset={dataset} onSelect={select} />
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
            </section>

            <section className="panel panel-code" aria-label="コード">
              <CodeView
                code={algo.code}
                lang={lang}
                onLang={setLang}
                point={step.point}
                replace={algo.datasets && dataset && dataset.id !== 'standard' ? [SORT_INPUT.join(', '), dataset.input.join(', ')] : undefined}
              />
            </section>
          </main>

          <footer className="dock">
            <StepControls
              current={current}
              total={total}
              playing={playing}
              speed={speed}
              onChange={(n) => {
                setPlaying(false);
                goTo(n);
              }}
              onTogglePlay={togglePlay}
              onSpeed={setSpeed}
            />
          </footer>
          <p className="credit">
            <abbr title="VISualize Algorithms as Small, Cute, Stylized Characters.">VISA-SCSC</abbr> — <b>VIS</b>ualize{' '}
            <b>A</b>lgorithms as <b>S</b>mall, <b>C</b>ute, <b>S</b>tylized <b>C</b>haracters.
          </p>
        </div>
      </div>
    </div>
  );
}

function DataPicker({ datasets, current, onSelect }: { datasets: Dataset[]; current: DatasetId; onSelect: (d: DatasetId) => void }) {
  return (
    <div className="data-picker">
      <span className="data-picker-label">データ</span>
      <div className="speed" role="radiogroup" aria-label="整列するデータ">
        {datasets.map((d) => (
          <button
            key={d.id}
            type="button"
            role="radio"
            aria-checked={d.id === current}
            className={d.id === current ? 'on' : ''}
            onClick={() => onSelect(d.id)}
          >
            {DATASET_LABEL[d.id]}
          </button>
        ))}
      </div>
      <code className="data-picker-values">{'{' + datasets.find((d) => d.id === current)!.input.join(', ') + '}'}</code>
    </div>
  );
}

function Intro({ algo, dataset, onSelect }: { algo: Algorithm; dataset?: Dataset; onSelect: (id: string) => void }) {
  const sorts = categories.find((c) => c.name === algo.category && c.name === '整列')?.items;
  return (
    <div className="intro">
      {algo.intro.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {dataset && (
        <p className={`dataset-note dataset-${dataset.id}`}>
          <b>{DATASET_LABEL[dataset.id]}のデータ</b>
          {dataset.note}
        </p>
      )}
      {algo.target !== undefined && (
        <p className="intro-target">
          この例では <b>{algo.target}</b> を探します。
        </p>
      )}
      <h3>科目B のチェックポイント</h3>
      <ul>
        {algo.examPoints.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <h3>計算量</h3>
      <table className="complexity">
        <tbody>
          <tr>
            <th>最良</th>
            <td>{algo.complexity.best}</td>
            <th>平均</th>
            <td>{algo.complexity.average}</td>
            <th>最悪</th>
            <td>{algo.complexity.worst}</td>
          </tr>
        </tbody>
      </table>
      {algo.complexity.note && <p className="note">{algo.complexity.note}</p>}
      {sorts && <SortCompare sorts={sorts} currentId={algo.id} kind={dataset?.id ?? 'standard'} onSelect={onSelect} />}
      <p className="intro-start">「進む」または → キーで開始</p>
    </div>
  );
}
