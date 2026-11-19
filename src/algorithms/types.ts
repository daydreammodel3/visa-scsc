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
 */
export type Mark = 'compare' | 'swap' | 'sorted' | 'found' | 'out' | 'min' | 'miss';

/** 配列の位置を指す変数（i, j, low, mid など） */
export interface Pointer {
  name: string;
  /** 0 始まりの位置。擬似言語では表示時に +1 する。範囲外（-1 や n）も可 */
  index: number;
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
  held?: { item: Item; over: number } | null;
  marks: Partial<Record<number, Mark>>;
  pointers: Pointer[];
  vars: Var[];
  /** 比較回数・交換回数など */
  stats: { label: string; value: number }[];
  /** 説明文。位置は f で表示用に変換する */
  text: (f: IndexFmt) => string;
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
  /** 入力。コードのサンプル入力と同じにする（check:samples で確かめる） */
  input: number[];
  target?: number;
  trace: () => Step[];
  /** 最後の結果を各言語のサンプルが出力する文字列（擬似言語以外） */
  expectedOutput: string;
  code: Record<LangId, string>;
}
