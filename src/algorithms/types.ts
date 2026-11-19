/** 対応言語。pseudo は IPA 基本情報技術者試験（科目B）の擬似言語 */
export type LangId = 'pseudo' | 'python' | 'js' | 'cpp' | 'rust' | 'ruby' | 'perl';

/** 配列の要素。id は要素ごとに固定で、並べ替えのアニメーションに使う */
export interface Item {
  id: number;
  value: number;
}

/**
 * キャラクターの状態（見た目）
 * - compare: 比べられている
 * - swap: 入れかわっている
 * - sorted: 位置が確定した
 * - found: 見つかった
 * - out: 探す範囲の外（二分探索）
 * - min: いまの最小値（選択ソート）
 * - miss: 比べたが違った
 * - pivot: 基準値（クイックソート）
 */
export type Mark = 'compare' | 'swap' | 'sorted' | 'found' | 'out' | 'min' | 'miss' | 'pivot';

/** 配列の位置を指す変数（i, j, low, mid など） */
export interface Pointer {
  name: string;
  /** 0 始まりの位置。擬似言語では表示時に +1 する。範囲外（-1 や n）も可 */
  index: number;
  /** 'aux' なら 2 段目の配列（マージソートの tmp）を指す */
  row?: 'aux';
}

/** 呼び出し中の関数（コールスタックの 1 段） */
export interface Frame {
  /** 段ごとに固定。アニメーション用 */
  id: number;
  /** "factorial(3)" など。位置を含むので f で表示用に変換する */
  label: (f: IndexFmt) => string;
  /** "3 × factorial(2) の結果を待っている" など */
  note?: (f: IndexFmt) => string;
  /** キャラのおなかに出す値（再帰の引数など） */
  value?: number;
  /** 返した値 */
  ret?: number | string;
  /** ret が配列の位置か（擬似言語では表示時に +1 する） */
  retIndex?: boolean;
  state: 'active' | 'waiting' | 'returning';
}

/** 変数パネルに出す値 */
export interface Var {
  name: string;
  value: number | string | null;
  /** true なら配列の位置。擬似言語（1 始まり）では表示時に +1 する */
  index?: boolean;
}

/** 位置の表示方法。擬似言語は 1 始まり、その他の言語は 0 始まり */
export type IndexFmt = (i: number) => number;

export interface Step {
  /** コードのどの行か。コード中の ⟦point⟧ と対応。null なら行を光らせない */
  point: string | null;
  /** 配列の中身。null は「空いている場所」（挿入ソートで key を持ち上げたあと） */
  items: (Item | null)[];
  /** 配列から持ち上げている要素（挿入ソートの key） */
  held?: { item: Item; over: number; mark?: Mark } | null;
  /** 2 段目の配列（マージソートの作業用配列 tmp） */
  aux?: (Item | null)[];
  /** コールスタック。下が最初の呼び出し */
  frames?: Frame[];
  marks: Partial<Record<number, Mark>>;
  pointers: Pointer[];
  vars: Var[];
  /** 比較回数・交換回数など */
  stats: { label: string; value: number }[];
  /** 説明文。位置は f で表示用に変換する */
  text: (f: IndexFmt) => string;
}

/** 入力データの種類（整列で、最良・最悪のパターンを選べるようにする） */
/** custom はユーザーが入力したデータ（datasets には入れず、URL で持つ） */
export type DatasetId = 'standard' | 'best' | 'worst' | 'custom';

export interface Dataset {
  id: DatasetId;
  input: number[];
  /** なぜこのデータが最良・最悪なのか */
  note: string;
}

/** 図の描き方 */
export interface View {
  /** 配列のマスを描くか（線形リストでは描かない） */
  cells?: boolean;
  /** となりの要素へ矢印を引くか（線形リスト） */
  links?: boolean;
  /** 配列の名前（左に出す） */
  label?: string;
  /** 2 段目の配列の名前 */
  auxLabel?: string;
  /** 持ち上げた要素の段の名前 */
  heldLabel?: string;
  /** 位置の番号を出すか */
  indices?: boolean;
}

export interface Algorithm {
  id: string;
  name: string;
  /** 英語名 */
  en: string;
  category: string;
  level: 1 | 2 | 3;
  tagline: string;
  intro: string[];
  /** 科目B で問われやすいところ */
  examPoints: string[];
  complexity: { best: string; average: string; worst: string; note?: string };
  /** 入力。整列・探索ではコードのサンプル入力の配列と同じにする（テストで確かめる） */
  input: number[];
  /** 図の描き方。省略すると普通の配列 */
  view?: View;
  /** 入力の配列がサンプルコードにそのまま書かれているか（整列・探索） */
  inputIsArray?: boolean;
  target?: number;
  /** データの選択肢（整列のみ）。先頭が標準で、input と同じ */
  datasets?: Dataset[];
  /** 入力を省略すると input で動かす */
  trace: (input?: number[]) => Step[];
  /** 最後の結果を各言語のサンプルが出力する文字列（擬似言語以外） */
  expectedOutput: string;
  code: Record<LangId, string>;
}
