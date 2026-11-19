import type { Algorithm, Dataset } from '../algorithms/types';
import { DATASET_LABEL } from '../algorithms/sortInput';

/** ステップ 0 の説明（アルゴリズムの紹介・科目B のチェックポイント・計算量） */
export function Intro({ algo, dataset }: { algo: Algorithm; dataset?: Dataset }) {
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
      {algo.category === '整列' && <p className="note">ほかの整列と並べて動かすには、メニューの「ソートの比較」へ。</p>}
      <p className="intro-start">「進む」または → キーで開始</p>
    </div>
  );
}
