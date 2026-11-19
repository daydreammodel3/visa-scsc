import { useMemo } from 'react';
import type { Algorithm } from '../algorithms/types';

interface Props {
  sorts: Algorithm[];
  /** 強調する行（比較中の 2 つ） */
  highlight: string[];
}

/** 同じデータ（標準）を整列したときの、ステップ数・比較回数・交換（移動）回数の比較表 */
export function SortCompare({ sorts, highlight }: Props) {
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
    <section className="panel sort-compare" aria-label="同じデータでの比較">
      <h3>同じデータ {sorts[0]?.input.join(', ')} での比較</h3>
      <div className="sort-compare-scroll">
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
              <tr key={r.a.id} className={highlight.includes(r.a.id) ? 'on' : undefined}>
                <th>{r.a.name}</th>
                <td>{r.steps}</td>
                <td>{r.compares ?? '—'}</td>
                <td>{r.swaps === undefined ? '—' : `${r.swaps}（${r.swapLabel}）`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">
        ステップ数は、この図で 1 回「進む」を押す単位（コードの数行のまとまり）で数えた目安です。手間を公平に比べるなら比較回数を見てください。マージソートは入れかえではなく作業用の配列へ写すので「—」にしています。
      </p>
    </section>
  );
}
