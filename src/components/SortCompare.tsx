import { useMemo } from 'react';
import type { Algorithm, DatasetId } from '../algorithms/types';
import { DATASET_LABEL } from '../algorithms/sortInput';

interface Props {
  sorts: Algorithm[];
  currentId: string;
  /** どのデータどうしで比べるか */
  kind: DatasetId;
  onSelect: (id: string) => void;
}

/** 整列アルゴリズムの、ステップ数・比較回数・交換（移動）回数の比較表 */
export function SortCompare({ sorts, currentId, kind, onSelect }: Props) {
  const rows = useMemo(
    () =>
      sorts.map((a) => {
        const input = a.datasets?.find((d) => d.id === kind)?.input ?? a.input;
        const steps = a.trace(input);
        const stats = new Map(steps[steps.length - 1].stats.map((s) => [s.label, s.value]));
        return {
          a,
          input,
          steps: steps.length,
          compares: stats.get('比較回数'),
          swaps: stats.get('交換回数') ?? stats.get('移動回数'),
          swapLabel: stats.has('交換回数') ? '交換' : stats.has('移動回数') ? 'ずらし' : '',
        };
      }),
    [sorts, kind],
  );
  const same = rows.every((r) => r.input.join() === rows[0].input.join());
  return (
    <div className="sort-compare">
      <h3>{kind === 'standard' ? `同じデータ ${rows[0]?.input.join(', ')} での比較` : `それぞれの${DATASET_LABEL[kind]}のデータでの比較`}</h3>
      <div className="sort-compare-scroll">
        <table>
          <thead>
            <tr>
              <th>アルゴリズム</th>
              {!same && <th>データ</th>}
              <th>ステップ数</th>
              <th>比較回数</th>
              <th>交換・ずらし回数</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.a.id} className={r.a.id === currentId ? 'on' : undefined}>
                <th>
                  {r.a.id === currentId ? (
                    r.a.name
                  ) : (
                    <button type="button" className="link-button" onClick={() => onSelect(r.a.id)}>
                      {r.a.name}
                    </button>
                  )}
                </th>
                {!same && <td className="sort-compare-data">{r.input.join(' ')}</td>}
                <td>{r.steps}</td>
                <td>{r.compares ?? '—'}</td>
                <td>{r.swaps === undefined ? '—' : `${r.swaps}（${r.swapLabel}）`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">
        {kind !== 'standard' && '最良・最悪のデータはアルゴリズムごとに違います。'}
        ステップ数は、この図で 1 回「進む」を押す単位（コードの数行のまとまり）で数えた目安です。マージソートは入れかえではなく作業用の配列へ写すので「—」にしています。
      </p>
    </div>
  );
}
