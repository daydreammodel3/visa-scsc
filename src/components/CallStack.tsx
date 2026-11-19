import type { Frame, IndexFmt } from '../algorithms/types';
import { NumBuddy, bodyColor } from './NumBuddy';

interface Props {
  frames: Frame[];
  fmt: IndexFmt;
  range: [number, number];
  /** 引数をキャラで見せる（再帰の階乗など、配列がないとき） */
  buddies: boolean;
}

const STATE_LABEL: Record<Frame['state'], string> = {
  active: '実行中',
  waiting: '待ち',
  returning: '戻る',
};

/** コールスタック。新しい呼び出しほど上に積む */
export function CallStack({ frames, fmt, range, buddies }: Props) {
  return (
    <div className={buddies ? 'callstack callstack-big' : 'callstack'}>
      <h3>コールスタック</h3>
      {frames.length === 0 ? (
        <p className="callstack-empty">（呼び出し中の関数はありません）</p>
      ) : (
        <ol className="frames">
          {[...frames].reverse().map((f, k) => (
            <li key={f.id} className={`frame frame-${f.state}`} style={{ zIndex: frames.length - k }}>
              {buddies && f.value !== undefined && (
                <NumBuddy size={buddies ? 52 : 40} value={f.value} color={bodyColor(f.value, range[0], range[1])} mark={f.state === 'returning' ? 'found' : undefined} />
              )}
              <div className="frame-body">
                <code className="frame-label">{f.label(fmt)}</code>
                {f.note && <span className="frame-note">{f.note(fmt)}</span>}
              </div>
              <span className="frame-state">{STATE_LABEL[f.state]}</span>
              {f.ret !== undefined && (
                <span className="frame-ret" title="返す値">
                  ⮐ {f.retIndex && typeof f.ret === 'number' ? fmt(f.ret) : f.ret}
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
