import type { IndexFmt, Item, Mark, Pointer, Step, View } from '../algorithms/types';
import { NumBuddyShape, bodyColor } from './NumBuddy';

const BUDDY = 100;
const LIFT_H = 124;
const ARRAY_H = 116;
const POINTER_ROW = 36;
const INDEX_H = 34;

/** 変数ごとの矢印の色 */
const POINTER_COLORS: Record<string, string> = {
  i: '#ff6b6b',
  j: '#4dabf7',
  'j+1': '#74c0fc',
  k: '#f76707',
  low: '#20c997',
  high: '#f59f00',
  mid: '#cc5de8',
  min: '#12b886',
  left: '#20c997',
  right: '#f59f00',
  p: '#cc5de8',
  top: '#f03e3e',
  head: '#1c7ed6',
  tail: '#e8590c',
  listHead: '#7048e8',
  prev: '#1098ad',
  curr: '#e64980',
};

/** ステップをまたいで固定する大きさ（ステップごとに図の大きさが変わってガタつかないように） */
export interface StageLayout {
  slots: number;
  lift: boolean;
  aux: boolean;
  ptrRows: number;
  auxPtrRows: number;
}

function pointerRows(ps: Pointer[]): Map<Pointer, number> {
  const used = new Map<number, number>();
  const rows = new Map<Pointer, number>();
  for (const p of ps) {
    const row = used.get(p.index) ?? 0;
    used.set(p.index, row + 1);
    rows.set(p, row);
  }
  return rows;
}

export function measureLayout(steps: Step[]): StageLayout {
  const maxRows = (sel: (s: Step) => Pointer[]) =>
    Math.max(0, ...steps.map((s) => Math.max(0, ...[...pointerRows(sel(s)).values()].map((r) => r + 1))));
  return {
    slots: Math.max(0, ...steps.map((s) => s.items.length)),
    lift: steps.some((s) => s.held),
    aux: steps.some((s) => s.aux),
    ptrRows: maxRows((s) => s.pointers.filter((p) => p.row !== 'aux')),
    auxPtrRows: maxRows((s) => s.pointers.filter((p) => p.row === 'aux')),
  };
}

interface Props {
  step: Step;
  layout: StageLayout;
  view: View;
  /** 値の最小・最大（色を決める） */
  range: [number, number];
  fmt: IndexFmt;
  travelMs: number;
  label: string;
}

export function ArrayStage({ step, layout, view, range, fmt, travelMs, label }: Props) {
  // 線形リストは矢印を見せるため、間をあける
  const SLOT = view.links ? 156 : 108;
  const n = layout.slots;
  const cells = view.cells !== false;
  const indices = view.indices !== false;
  const top = layout.lift ? LIFT_H : 8;
  const indexY = top + ARRAY_H + 22;
  const ptrTop = top + ARRAY_H + (indices ? INDEX_H : 8);
  const auxTop = ptrTop + layout.ptrRows * POINTER_ROW + 14;
  const auxIndexY = auxTop + ARRAY_H + 22;
  const auxPtrTop = auxTop + ARRAY_H + INDEX_H;
  const height = layout.aux ? auxPtrTop + layout.auxPtrRows * POINTER_ROW + 8 : ptrTop + layout.ptrRows * POINTER_ROW + 8;
  // 位置 -1 と n の矢印も描けるよう、左右に 1 マスずつ余白をとる
  const width = (n + 2) * SLOT;
  const slotX = (i: number) => (i + 1) * SLOT;

  // DOM の並びを固定してアニメーションを途切れさせないよう、id 順に描く
  const placed: { item: Item; x: number; y: number; mark?: Mark }[] = [];
  step.items.forEach((it, i) => {
    if (it) placed.push({ item: it, x: slotX(i), y: top, mark: step.marks[i] });
  });
  step.aux?.forEach((it, i) => {
    if (it) placed.push({ item: it, x: slotX(i), y: auxTop });
  });
  if (step.held) placed.push({ item: step.held.item, x: slotX(step.held.over), y: 6, mark: step.held.mark ?? 'compare' });
  placed.sort((a, b) => a.item.id - b.item.id);

  // 線形リストの矢印：たどる順にとなりの要素へ（空いた場所は飛ばす）
  const links: { from: number; to: number | null }[] = [];
  if (view.links) {
    const filled = step.items.map((it, i) => (it ? i : -1)).filter((i) => i >= 0);
    filled.forEach((from, k) => links.push({ from, to: filled[k + 1] ?? null }));
  }

  const rows = pointerRows(step.pointers.filter((p) => p.row !== 'aux'));
  const auxRows = pointerRows(step.pointers.filter((p) => p.row === 'aux'));

  return (
    <svg className="stage-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <defs>
        <marker id="arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#6b6577" />
        </marker>
      </defs>
      {layout.lift && view.heldLabel !== '' && (
        <text x={SLOT - 12} y={56} textAnchor="end" className="row-label">
          {view.heldLabel ?? 'key'}
        </text>
      )}
      <text x={SLOT - 12} y={top + ARRAY_H / 2 + 6} textAnchor="end" className="row-label">
        {view.label ?? 'data'}
      </text>
      {layout.aux && (
        <text x={SLOT - 12} y={auxTop + ARRAY_H / 2 + 6} textAnchor="end" className="row-label">
          {view.auxLabel ?? 'tmp'}
        </text>
      )}
      {/* マス目 */}
      {Array.from({ length: n }, (_, i) => (
        <g key={`cell-${i}`}>
          {cells && (
            <rect x={slotX(i) + 4} y={top + 10} width={SLOT - 8} height={ARRAY_H - 4} rx="22" className={step.items[i] ? 'cell' : 'cell cell-empty'} />
          )}
          {indices && (
            <text x={slotX(i) + SLOT / 2} y={indexY} textAnchor="middle" className="index-label">
              {fmt(i)}
            </text>
          )}
          {layout.aux && (
            <>
              <rect x={slotX(i) + 4} y={auxTop + 10} width={SLOT - 8} height={ARRAY_H - 4} rx="22" className={step.aux?.[i] ? 'cell cell-aux' : 'cell cell-aux cell-empty'} />
              <text x={slotX(i) + SLOT / 2} y={auxIndexY} textAnchor="middle" className="index-label">
                {fmt(i)}
              </text>
            </>
          )}
        </g>
      ))}
      {/* リストの矢印 */}
      {links.map(({ from, to }) => {
        const y = top + 58;
        const x1 = slotX(from) + SLOT / 2 + 44;
        if (to === null) {
          return (
            <g key={`link-${from}`} className="link-end">
              <path d={`M${x1} ${y} h28`} className="link" markerEnd="url(#arrow-head)" />
              <text x={x1 + 36} y={y + 6} className="link-null">
                未定義
              </text>
            </g>
          );
        }
        const x2 = slotX(to) + SLOT / 2 - 46;
        const skip = to - from > 1;
        const d = skip ? `M${x1} ${y + 26} C ${x1 + 30} ${y + 80}, ${x2 - 30} ${y + 80}, ${x2} ${y + 26}` : `M${x1} ${y} L${x2} ${y}`;
        return <path key={`link-${from}`} d={d} className={skip ? 'link link-skip' : 'link'} markerEnd="url(#arrow-head)" />;
      })}
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
      {step.pointers.map((p) => {
        const aux = p.row === 'aux';
        const row = (aux ? auxRows : rows).get(p) ?? 0;
        const color = POINTER_COLORS[p.name] ?? '#868e96';
        const cx = slotX(p.index) + SLOT / 2;
        const y = (aux ? auxPtrTop : ptrTop) + 4 + row * POINTER_ROW;
        const w = Math.max(34, p.name.length * 11 + 18);
        return (
          <g
            key={`${p.row ?? 'main'}-${p.name}`}
            className="mover"
            style={{ transform: `translate(${cx}px, ${y}px)`, transitionDuration: `${Math.min(travelMs, 500)}ms` }}
          >
            {row === 0 && <path d="M0 -6 L8 4 L-8 4 Z" fill={color} />}
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
