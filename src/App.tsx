import { useCallback, useEffect, useMemo, useState } from 'react';
import { algorithms, categories, findAlgorithm } from './algorithms';
import type { DatasetId, LangId } from './algorithms/types';
import { SORT_INPUT } from './algorithms/sortInput';
import { AlgoHead, CompareHead } from './components/AlgoHead';
import { AlgorithmStage } from './components/AlgorithmStage';
import { AppHeader } from './components/AppHeader';
import { CompareView } from './components/CompareView';
import { SeriesLinks } from './components/SeriesLinks';
import { SideNav } from './components/SideNav';
import { SPEEDS, StepControls, type Speed } from './components/StepControls';
import { useHashRoute, useSyncHash } from './hooks/useHashRoute';
import { useNavDrawer } from './hooks/useNavDrawer';
import { usePlayback } from './hooks/usePlayback';
import { findLang } from './lib/code';
import { DEFAULT_COMPARE, toHash } from './lib/route';
import { comparisonIndices } from './lib/steps';
import { load, save } from './lib/storage';
import { UI } from './lib/text';

export default function App() {
  const [route, setRoute] = useHashRoute();
  const [speed, setSpeed] = useState<Speed>('normal');
  const [lang, setLang] = useState<LangId>(() => findLang(load('lang'))?.id ?? 'pseudo');
  const nav = useNavDrawer();

  const algo = findAlgorithm(route.algorithmId) ?? algorithms[0];
  // 任意データは整列（datasets を持つアルゴリズム）でだけ使える
  const custom = route.dataset === 'custom' && route.custom && (algo.datasets || route.compare) ? route.custom : undefined;
  const dataset = custom ? undefined : algo.datasets?.find((d) => d.id === route.dataset);
  const datasetId: DatasetId = custom ? 'custom' : (dataset?.id ?? 'standard');
  const input = custom ?? dataset?.input ?? algo.input;
  const steps = useMemo(() => algo.trace(input), [algo, input]);
  const compare = route.compare;
  /** 比較表示で使うデータ（標準か任意） */
  const compareInput = custom ?? SORT_INPUT;
  // 比較表示では 1 ステップ = 比較 1 回。比較の多いほうが終わり、整列済みの状態を見せるところまで進められる
  const compareTotal = useMemo(
    () => (compare ? Math.max(...compare.map((id) => comparisonIndices(findAlgorithm(id)!.trace(compareInput)).length)) + 1 : 0),
    [compare, compareInput],
  );
  const total = compare ? compareTotal : steps.length;
  const current = Math.min(route.step, total);

  const base = findLang(lang)?.base ?? 0;
  const fmt = useCallback((i: number) => i + base, [base]);

  useEffect(() => save('lang', lang), [lang]);
  useSyncHash(toHash({ algorithmId: algo.id, step: current, dataset: datasetId, custom, compare }));

  const goTo = useCallback(
    (n: number) => setRoute((r) => ({ ...r, step: Math.min(Math.max(n, 0), total) })),
    [setRoute, total],
  );
  const playback = usePlayback({ current, total, goTo, interval: SPEEDS[speed].interval, keysEnabled: !nav.drawerShown });

  /** 整列どうしで移るときは、選んでいるデータの種類（最良・最悪・任意）を引き継ぐ */
  const select = (id: string) => {
    playback.stop();
    const next = findAlgorithm(id);
    setRoute((r) => {
      if (r.dataset === 'custom' && r.custom && next?.datasets) return { algorithmId: id, step: 0, dataset: 'custom', custom: r.custom };
      return { algorithmId: id, step: 0, dataset: next?.datasets?.some((d) => d.id === r.dataset) ? r.dataset : 'standard' };
    });
    nav.closeIfNarrow();
  };

  /** 比較表示を開く。いま整列を見ているなら、それを左側にする */
  const openCompare = () => {
    playback.stop();
    setRoute((r) => {
      const left = algorithms.find((a) => a.id === r.algorithmId && a.category === '整列')?.id ?? DEFAULT_COMPARE[0];
      const right = left === DEFAULT_COMPARE[1] ? DEFAULT_COMPARE[0] : DEFAULT_COMPARE[1];
      // 任意データはそのまま比較にも使う（最良・最悪はアルゴリズムごとに違うので標準に戻す）
      const keep = r.dataset === 'custom' && r.custom ? { dataset: 'custom' as const, custom: r.custom } : { dataset: 'standard' as const };
      return { algorithmId: left, step: 0, ...keep, compare: r.compare ?? [left, right] };
    });
    nav.closeIfNarrow();
  };

  const pickCompare = (side: 0 | 1, id: string) => {
    playback.stop();
    setRoute((r) => {
      const pair: [string, string] = [...(r.compare ?? DEFAULT_COMPARE)];
      pair[side] = id;
      return { ...r, algorithmId: pair[0], step: 0, compare: pair };
    });
  };

  const dataProps = {
    datasetId,
    custom: route.custom,
    onSelectDataset: (d: DatasetId) => {
      playback.stop();
      setRoute((r) => ({ ...r, dataset: d, step: 0 }));
    },
    onCustom: (values: number[]) => {
      playback.stop();
      setRoute((r) => ({ ...r, dataset: 'custom', custom: values, step: 0 }));
    },
  };

  const travelMs = SPEEDS[speed].travel;

  return (
    <div className="app">
      <AppHeader navOpen={nav.navOpen} onToggleNav={nav.toggleNav} />

      <div className={nav.navOpen ? 'shell nav-open' : 'shell'}>
        {nav.navOpen && (
          <SideNav
            id="sidenav"
            categories={categories}
            currentId={compare ? '' : algo.id}
            compareActive={!!compare}
            onCompare={openCompare}
            label={UI.pickAlgorithm}
            onSelect={select}
            onClose={nav.narrow ? nav.closeDrawer : undefined}
            closeLabel={UI.closeMenu}
          />
        )}
        {nav.drawerShown && <div className="backdrop" onClick={nav.closeDrawer} aria-hidden="true" />}

        <div className="content">
          {compare ? <CompareHead input={compareInput} {...dataProps} /> : <AlgoHead algo={algo} input={input} {...dataProps} />}

          {compare ? (
            <CompareView ids={compare} input={compareInput} step={current} fmt={fmt} travelMs={travelMs} onPick={pickCompare} />
          ) : (
            <AlgorithmStage
              algo={algo}
              steps={steps}
              current={current}
              total={total}
              input={input}
              datasetId={datasetId}
              dataset={dataset}
              custom={custom}
              lang={lang}
              onLang={setLang}
              fmt={fmt}
              travelMs={travelMs}
            />
          )}

          <footer className="dock">
            <StepControls
              current={current}
              total={total}
              playing={playback.playing}
              speed={speed}
              onChange={playback.jump}
              onTogglePlay={playback.togglePlay}
              onSpeed={setSpeed}
            />
          </footer>
          <p className="credit">
            <abbr title="VISualize Algorithms as Small, Cute, Stylized Characters.">VISA-SCSC</abbr> — <b>VIS</b>ualize{' '}
            <b>A</b>lgorithms as <b>S</b>mall, <b>C</b>ute, <b>S</b>tylized <b>C</b>haracters.
          </p>
          <SeriesLinks current="visa" />
        </div>
      </div>
    </div>
  );
}
