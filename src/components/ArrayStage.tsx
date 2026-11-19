import type { IndexFmt, Item, Step } from '../algorithms/types';
import { NumBuddyShape, bodyColor } from './NumBuddy';

const SLOT = 108;
const BUDDY = 100;
const LIFT_H = 124;
const ARRAY_H = 116;
const POINTER_ROW = 36;

/** 変数ごとの矢印の色 */
const POINTER_COLORS: Record<string, string> = {
  i: '#ff6b6b',
  j: '#4dabf7',
  'j+1': '#74c0fc',
  low: '#20c997',
  high: '#f59f00',
  mid: '#cc5de8',
  min: '#12b886',
};

interface Props {
  step: Step;
  /** 値の最小・最大（色を決める） */
  range: [number, number];
  /** 持ち上げる段（挿入ソート）を用意するか */
  liftRow: boolean;
  fmt: IndexFmt;
  travelMs: number;
  label: string;
}

export function ArrayStage({ step, range, liftRow, fmt, travelMs, label }: Props) {
  const n = step.items.length;
  const top = liftRow ? LIFT_H : 8;
  const indexY = top + ARRAY_H + 22;
  const ptrRows = new Map<number, number>();
  const pointers = step.pointers.map((p) => {
    const row = ptrRows.get(p.index) ?? 0;
    ptrRows.set(p.index, row + 1);
    return { ...p, row };
  });
  const maxRow = Math.max(0, ...pointers.map((p) => p.row + 1));
  const height = indexY + 18 + maxRow * POINTER_ROW + 8;
  // 位置 -1 と n の矢印も描けるよう、左右に 1 マスずつ余白をとる
  const width = (n + 2) * SLOT;
  const slotX = (i: number) => (i + 1) * SLOT;

  // DOM の並びを固定してアニメーションを途切れさせないよう、id 順に描く
  const placed: { item: Item; x: number; y: number; mark?: Step['marks'][number] }[] = [];
  step.items.forEach((it, i) => {
    if (it) placed.push({ item: it, x: slotX(i), y: top, mark: step.marks[i] });
  });
  if (step.held) placed.push({ item: step.held.item, x: slotX(step.held.over), y: 6, mark: 'compare' });
  placed.sort((a, b) => a.item.id - b.item.id);

  return (
    <svg className="stage-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      {liftRow && (
        <text x={SLOT - 12} y={56} textAnchor="end" className="row-label">
          key
        </text>
      )}
      <text x={SLOT - 12} y={top + ARRAY_H / 2 + 6} textAnchor="end" className="row-label">
        data
      </text>
      {/* マス目 */}
      {step.items.map((it, i) => (
        <g key={`cell-${i}`}>
          <rect
            x={slotX(i) + 4}
            y={top + 10}
            width={SLOT - 8}
            height={ARRAY_H - 4}
            rx="22"
            className={it ? 'cell' : 'cell cell-empty'}
          />
          <text x={slotX(i) + SLOT / 2} y={indexY} textAnchor="middle" className="index-label">
            {fmt(i)}
          </text>
        </g>
      ))}
      {/* キャラ */}
      {placed.map(({ item, x, y, mark }) => (
        <g
          key={item.id}
          className="mover"
          style={{ transform: `translate(${x + (SLOT - BUDDY) / 2}px, ${y}px)`, transitionDuration: `${travelMs}ms` }}
        >
          <NumBuddyShape value={item.value} color={bodyColor(item.value, range[0], range[1])} mark={mark} />
        </g>
      ))}
      {/* 変数の矢印 */}
      {pointers.map((p) => {
        const color = POINTER_COLORS[p.name] ?? '#868e96';
        const cx = slotX(p.index) + SLOT / 2;
        const y = indexY + 12 + p.row * POINTER_ROW;
        const w = Math.max(34, p.name.length * 12 + 18);
        return (
          <g
            key={p.name}
            className="mover"
            style={{ transform: `translate(${cx}px, ${y}px)`, transitionDuration: `${Math.min(travelMs, 500)}ms` }}
          >
            {p.row === 0 && <path d="M0 -6 L8 4 L-8 4 Z" fill={color} />}
            <rect x={-w / 2} y={4} width={w} height={24} rx={12} fill={color} />
            <text x={0} y={17} textAnchor="middle" dominantBaseline="central" className="pointer-label">
              {p.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
