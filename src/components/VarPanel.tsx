import type { IndexFmt, Step } from '../algorithms/types';

interface Props {
  step: Step;
  prev?: Step;
  fmt: IndexFmt;
}

function show(v: Step['vars'][number], fmt: IndexFmt): string {
  if (v.value === null) return '—';
  return v.index && typeof v.value === 'number' ? String(fmt(v.value)) : String(v.value);
}

/** 変数の値と、比較回数などのカウンタ */
export function VarPanel({ step, prev, fmt }: Props) {
  const before = new Map(prev?.vars.map((v) => [v.name, show(v, fmt)]));
  const beforeStats = new Map(prev?.stats.map((s) => [s.label, s.value]));
  return (
    <div className="vars">
      <h3>変数</h3>
      {step.vars.length === 0 ? (
        <p className="vars-empty">—</p>
      ) : (
        <dl className="var-list">
          {step.vars.map((v) => {
            const text = show(v, fmt);
            const changed = prev !== undefined && before.get(v.name) !== text;
            return (
              <div key={v.name} className={changed ? 'var changed' : 'var'}>
                <dt>{v.name}</dt>
                <dd>{text}</dd>
              </div>
            );
          })}
        </dl>
      )}
      {step.stats.length > 0 && (
        <dl className="stat-list">
          {step.stats.map((s) => (
            <div key={s.label} className={prev && beforeStats.get(s.label) !== s.value ? 'stat changed' : 'stat'}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
