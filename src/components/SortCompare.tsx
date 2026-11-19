import { useMemo } from 'react';
import { position, sortBounds, type SortId } from '../algorithms/bounds';
import type { Algorithm } from '../algorithms/types';

interface Props {
  sorts: Algorithm[];
  /** 強調する行（比較中の 2 つ） */
  highlight: string[];
  /** 整列するデータ（標準か任意） */
  input: number[];
}

/** 同じデータを整列したときの、比較回数・交換（移動）回数と、同じ個数での最良〜最悪の比較表 */
export function SortCompare({ sorts, highlight, input }: Props) {
  const n = input.length;
  const rows = useMemo(
    () =>
      sorts.map((a) => {
        const steps = a.trace(input);
        const stats = new Map(steps[steps.length - 1].stats.map((s) => [s.label, s.value]));
        const b = sortBounds(a.id as SortId, n);
        const compares = stats.get('比較回数') ?? 0;
        const swaps = stats.get('交換回数') ?? stats.get('移動回数');
        const swapLabel = stats.has('交換回数') ? '交換' : stats.has('移動回数') ? 'ずらし' : '';
        const metric = b.metric === 'compares' ? compares : (swaps ?? 0);
        const pick = (c: { compares: number; swaps: number | null }) => (b.metric === 'compares' ? c.compares : c.swaps!);
        return {
          a,
          compares,
          swaps,
          swapLabel,
          range:
            b.metric === 'compares'
              ? `比較 ${b.best.compares}〜${b.worst.compares}`
              : `比較 ${b.best.compares}（一定）／${swapLabel} ${b.best.swaps}〜${b.worst.swaps}`,
          where: position(metric, pick(b.best), pick(b.worst)),
        };
      }),
    [sorts, input, n],
  );
  return (
    <section className="panel sort-compare" aria-label="同じデータでの比較">
      <h3>同じデータ {input.join(', ')}（{n} 個）での比較</h3>
      <div className="sort-compare-scroll">
        <table>
          <thead>
            <tr>
              <th>アルゴリズム</th>
              <th>比較回数</th>
              <th>交換・ずらし回数</th>
              <th>{n} 個での最良〜最悪</th>
              <th>このデータは</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.a.id} className={highlight.includes(r.a.id) ? 'on' : undefined}>
                <th>{r.a.name}</th>
                <td>{r.compares}</td>
                <td>{r.swaps === undefined ? '—' : `${r.swaps}（${r.swapLabel}）`}</td>
                <td className="sort-compare-range">{r.range}</td>
                <td className="sort-compare-where">{r.where}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">
        比較表示の 1 ステップは比較 1 回なので、比較回数がそのままステップ数になります。最良・最悪は、値がすべて異なる {n} 個を並べかえたときの最小・最大です（バブル・選択ソートは比較回数が一定なので交換回数で判定）。マージソートは入れかえではなく作業用の配列へ写すので「—」にしています。
      </p>
    </section>
  );
}
