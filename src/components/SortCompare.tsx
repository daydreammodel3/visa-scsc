import { useMemo } from 'react';
import type { Algorithm } from '../algorithms/types';

interface Props {
  sorts: Algorithm[];
  currentId: string;
  onSelect: (id: string) => void;
}

/** 同じデータを整列したときの、ステップ数・比較回数・交換（移動）回数の比較表 */
export function SortCompare({ sorts, currentId, onSelect }: Props) {
  const rows = useMemo(
    () =>
      sorts.map((a) => {
        const steps = a.trace();
        const stats = new Map(steps[steps.length - 1].stats.map((s) => [s.label, s.value]));
        return {
          a,
          steps: steps.length,
          compares: stats.get('比較回数'),
          swaps: stats.get('交換回数') ?? stats.get('移動回数'),
          swapLabel: stats.has('交換回数') ? '交換' : stats.has('移動回数') ? 'ずらし' : '',
        };
      }),
    [sorts],
  );
  return (
    <div className="sort-compare">
      <h3>同じデータ {sorts[0]?.input.join(', ')} での比較</h3>
      <table>
        <thead>
          <tr>
            <th>アルゴリズム</th>
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
              <td>{r.steps}</td>
              <td>{r.compares ?? '—'}</td>
              <td>{r.swaps === undefined ? '—' : `${r.swaps}（${r.swapLabel}）`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note">
        ステップ数は、この図で 1 回「進む」を押す単位（コードの数行のまとまり）で数えた目安です。マージソートは入れかえではなく作業用の配列へ写すので「—」にしています。
      </p>
    </div>
  );
}
