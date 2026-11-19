import type { Mark } from '../algorithms/types';

const INK = '#2d2a32';
const BLUSH = '#ff7aa2';

/** 値ごとの体の色。値の大きさがなんとなく色でわかるよう、虹の順に並べる */
const PALETTE = ['#ff8fa3', '#ffa94d', '#ffd43b', '#a9e34b', '#63e6be', '#4dabf7', '#9775fa', '#f783ac'];

export function bodyColor(value: number, min: number, max: number): string {
  if (max <= min) return PALETTE[3];
  const t = (value - min) / (max - min);
  return PALETTE[Math.round(t * (PALETTE.length - 1))];
}

interface Props {
  value: number | null;
  color: string;
  mark?: Mark;
  /** 先生役（数字のかわりにメガネ） */
  guide?: boolean;
}

/**
 * 配列の要素のミニキャラ「かずまる」。おなかに自分の値を書いている。
 * viewBox は 0 0 100 110（足元が y=104 付近）。
 */
export function NumBuddyShape({ value, color, mark, guide }: Props) {
  const grey = mark === 'out';
  const fill = grey ? '#d9d4cc' : color;
  const ink = grey ? '#8a8494' : INK;
  return (
    <g className={mark ? `buddy buddy-${mark}` : 'buddy'}>
      <ellipse cx="50" cy="104" rx="30" ry="4.5" fill="#000" opacity="0.12" />
      {/* あし */}
      <rect className="leg leg-l" x="30" y="88" width="13" height="14" rx="6.5" fill={ink} />
      <rect className="leg leg-r" x="57" y="88" width="13" height="14" rx="6.5" fill={ink} />
      {/* アホ毛 */}
      {mark !== 'min' && mark !== 'sorted' && mark !== 'found' && (
        <path d="M50 22 C 47 12, 58 10, 55 3" fill="none" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />
      )}
      {/* からだ（おもち形） */}
      <path
        d="M50 20 C 82 20 92 40 92 62 C 92 84 76 94 50 94 C 24 94 8 84 8 62 C 8 40 18 20 50 20 Z"
        fill={fill}
        stroke={ink}
        strokeWidth="3"
      />
      <ellipse cx="32" cy="34" rx="9" ry="4.5" fill="#fff" opacity="0.55" transform="rotate(-24 32 34)" />
      <Face mark={mark} ink={ink} />
      {/* おなかの数字 */}
      {guide ? (
        <Glasses />
      ) : (
        <g>
          <rect x="26" y="62" width="48" height="27" rx="13" fill="#fff" opacity={grey ? 0.6 : 0.92} />
          <text
            x="50"
            y="76"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={value !== null && Math.abs(value) >= 100 ? 19 : 23}
            fontWeight="800"
            fill={ink}
            fontFamily="'M PLUS Rounded 1c', system-ui, sans-serif"
          >
            {value}
          </text>
        </g>
      )}
      <Decoration mark={mark} />
    </g>
  );
}

function Face({ mark, ink }: { mark?: Mark; ink: string }) {
  const happy = mark === 'sorted' || mark === 'found';
  const sleepy = mark === 'out';
  const busy = mark === 'swap';
  return (
    <g>
      {happy ? (
        <path d="M30 47 q6 -7 12 0 M58 47 q6 -7 12 0" fill="none" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />
      ) : sleepy ? (
        <path d="M30 46 h11 M59 46 h11" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />
      ) : busy ? (
        <path d="M31 40 l9 5 l-9 5 M69 40 l-9 5 l9 5" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <g>
          <circle cx="36" cy="45" r={mark === 'compare' ? 6.5 : 5.5} fill={ink} />
          <circle cx="64" cy="45" r={mark === 'compare' ? 6.5 : 5.5} fill={ink} />
          <circle cx="38" cy="43" r="2" fill="#fff" />
          <circle cx="66" cy="43" r="2" fill="#fff" />
        </g>
      )}
      {!sleepy && (
        <>
          <ellipse cx="24" cy="54" rx="5.5" ry="3.3" fill={BLUSH} opacity="0.7" />
          <ellipse cx="76" cy="54" rx="5.5" ry="3.3" fill={BLUSH} opacity="0.7" />
        </>
      )}
      {mark === 'compare' ? (
        <ellipse cx="50" cy="56" rx="3.2" ry="3.8" fill={ink} />
      ) : (
        <path d="M45 54 Q50 59 55 54" fill="none" stroke={ink} strokeWidth="2.8" strokeLinecap="round" />
      )}
    </g>
  );
}

function Glasses() {
  return (
    <g fill="none" stroke={INK} strokeWidth="2.6">
      <circle cx="36" cy="45" r="11" />
      <circle cx="64" cy="45" r="11" />
      <path d="M47 45 h6" />
      <path d="M40 72 q10 8 20 0" strokeLinecap="round" />
    </g>
  );
}

function Decoration({ mark }: { mark?: Mark }) {
  switch (mark) {
    case 'compare':
      return (
        <g className="deco-pop">
          <circle cx="86" cy="14" r="12" fill="#fff6bf" stroke={INK} strokeWidth="2.5" />
          <text x="86" y="15" textAnchor="middle" dominantBaseline="central" fontSize="17" fontWeight="800" fill={INK}>
            ?
          </text>
        </g>
      );
    case 'swap':
      return (
        <g stroke={INK} strokeWidth="2.6" strokeLinecap="round" opacity="0.7">
          <path d="M2 50 h-8 M2 62 h-12 M98 50 h8 M98 62 h12" />
        </g>
      );
    case 'sorted':
      return (
        <path
          d="M50 4 l4.5 9 l10 1.5 l-7.2 7 l1.7 10 l-9 -4.7 l-9 4.7 l1.7 -10 l-7.2 -7 l10 -1.5 z"
          fill="#ffd23f"
          stroke={INK}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
      );
    case 'found':
      return (
        <g className="deco-pop">
          <path d="M33 22 L37 4 L46 14 L50 0 L54 14 L63 4 L67 22 Z" fill="#ffd23f" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M8 14 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 z" fill="#fff" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M88 26 l2.4 -6 l2.4 6 l6 2.4 l-6 2.4 l-2.4 6 l-2.4 -6 l-6 -2.4 z" fill="#fff" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
        </g>
      );
    case 'min':
      return (
        <g>
          <path d="M36 22 L39 8 L47 16 L50 4 L53 16 L61 8 L64 22 Z" fill="#c3fae8" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        </g>
      );
    case 'out':
      return (
        <g fill="#8a8494" fontWeight="800" fontFamily="sans-serif">
          <text x="80" y="22" fontSize="15">
            z
          </text>
          <text x="90" y="10" fontSize="11">
            z
          </text>
        </g>
      );
    default:
      return null;
  }
}

/** 単体で使える SVG 版 */
export function NumBuddy({ size = 64, className, ...rest }: Props & { size?: number; className?: string }) {
  return (
    <svg viewBox="-8 -6 116 116" width={size} height={size} className={className} aria-hidden="true" style={{ overflow: 'visible' }}>
      <NumBuddyShape {...rest} />
    </svg>
  );
}
