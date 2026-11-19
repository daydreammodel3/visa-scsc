import { position, sortBounds, type SortId } from '../algorithms/bounds';
import type { Step } from '../algorithms/types';

interface Props {
  algoId: SortId;
  input: number[];
  /** 最後のステップ（このデータでの回数） */
  last: Step;
}

/** 任意データの回数を、同じ個数での最良・最悪と並べる */
export function CustomBounds({ algoId, input, last }: Props) {
  const n = input.length;
  const b = sortBounds(algoId, n);
  const stats = new Map(last.stats.map((s) => [s.label, s.value]));
  const swapLabel = stats.has('移動回数') ? 'ずらし' : '交換';
  const actual = { compares: stats.get('比較回数') ?? 0, swaps: b.best.swaps === null ? null : (stats.get('交換回数') ?? stats.get('移動回数') ?? 0) };
  const metricName = b.metric === 'compares' ? '比較回数' : `${swapLabel}回数`;
  const pick = (c: { compares: number; swaps: number | null }) => (b.metric === 'compares' ? c.compares : c.swaps!);
  const where = position(pick(actual), pick(b.best), pick(b.worst));
  const row = (label: string, c: { compares: number; swaps: number | null }, cls?: string) => (
    <tr className={cls}>
      <th>{label}</th>
      <td>{c.compares}</td>
      {b.best.swaps !== null && <td>{c.swaps}</td>}
    </tr>
  );
  return (
    <div className="custom-bounds">
      <h3>このデータは最良〜最悪のどのあたり？</h3>
      <table>
        <thead>
          <tr>
            <th />
            <th>比較</th>
            {b.best.swaps !== null && <th>{swapLabel}</th>}
          </tr>
        </thead>
        <tbody>
          {row(`このデータ（${n} 個）`, actual, 'on')}
          {row(`最良（${n} 個）`, b.best, 'best')}
          {row(`最悪（${n} 個）`, b.worst, 'worst')}
        </tbody>
      </table>
      <p className="custom-verdict">
        {metricName}で見ると <b>{where}</b>
        {b.metric === 'swaps' && '（比較回数はデータによらず同じなので、交換回数で比べています）'}
      </p>
      <p className="note">最良・最悪は、値がすべて異なる {n} 個を並べかえたときの最小・最大です。同じ値があるデータでも、この範囲に入ります。</p>
    </div>
  );
}
