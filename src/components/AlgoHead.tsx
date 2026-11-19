import type { Algorithm, Dataset, DatasetId } from '../algorithms/types';
import { SORT_INPUT } from '../algorithms/sortInput';
import { LEVEL_LABEL } from '../lib/text';
import { DataPicker } from './DataPicker';

interface DataProps {
  datasetId: DatasetId;
  /** いま表示しているデータ */
  input: number[];
  /** ユーザーが入力したデータ（あれば） */
  custom?: number[];
  onSelectDataset: (d: DatasetId) => void;
  onCustom: (values: number[]) => void;
}

/** アルゴリズムの名前・難しさ・ひとこと説明（整列ならデータの選択も） */
export function AlgoHead({ algo, ...data }: DataProps & { algo: Algorithm }) {
  return (
    <div className="algo-head">
      <h2>
        {algo.name}
        <small>{algo.en}</small>
      </h2>
      <span className={`nav-level lv${algo.level}`}>{LEVEL_LABEL[algo.level]}</span>
      <p>{algo.tagline}</p>
      {algo.datasets && <Picker datasets={algo.datasets} {...data} />}
    </div>
  );
}

const STANDARD_ONLY: Dataset[] = [{ id: 'standard', input: SORT_INPUT, note: '' }];

/** ソートの比較の見出し（データは標準か任意だけ選べる） */
export function CompareHead(data: DataProps) {
  return (
    <div className="algo-head">
      <h2>
        ソートの比較
        <small>Compare</small>
      </h2>
      <p>同じデータを 2 つの整列で同時に動かします。1 ステップ = 比較 1 回です。比較が少ないほうが先に「完了！」になります。</p>
      <Picker datasets={STANDARD_ONLY} {...data} />
    </div>
  );
}

function Picker({ datasets, datasetId, input, custom, onSelectDataset, onCustom }: DataProps & { datasets: Dataset[] }) {
  return (
    <DataPicker
      datasets={datasets}
      current={datasetId}
      input={input}
      custom={custom}
      onSelect={onSelectDataset}
      onCustom={onCustom}
    />
  );
}
