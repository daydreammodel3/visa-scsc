import type { LangId } from '../algorithms/types';

export interface LangInfo {
  id: LangId;
  label: string;
  /** ファイルの拡張子（コードの見出しに出す） */
  ext: string;
  /** 配列の位置が何から始まるか */
  base: 0 | 1;
}

export const LANGS: LangInfo[] = [
  { id: 'pseudo', label: '擬似言語', ext: 'IPA', base: 1 },
  { id: 'python', label: 'Python', ext: 'py', base: 0 },
  { id: 'js', label: 'JavaScript', ext: 'js', base: 0 },
  { id: 'c', label: 'C', ext: 'c', base: 0 },
  { id: 'cpp', label: 'C++', ext: 'cpp', base: 0 },
  { id: 'java', label: 'Java', ext: 'java', base: 0 },
  { id: 'go', label: 'Go', ext: 'go', base: 0 },
  { id: 'rust', label: 'Rust', ext: 'rs', base: 0 },
  { id: 'swift', label: 'Swift', ext: 'swift', base: 0 },
  { id: 'ruby', label: 'Ruby', ext: 'rb', base: 0 },
  { id: 'perl', label: 'Perl', ext: 'pl', base: 0 },
];

export function findLang(id: string | null | undefined): LangInfo | undefined {
  return LANGS.find((l) => l.id === id);
}

export interface CodeLine {
  text: string;
  points: string[];
}

/**
 * 行末の目印 ⟦point⟧（言語のコメント記号つきでもよい）を取り出す。
 *   "    if data[j] > data[j + 1]:  # ⟦cmp⟧"  →  text: "    if data[j] > data[j + 1]:", points: ["cmp"]
 * 目印はコメントの中に書くので、サンプルのファイルはそのまま実行できる。
 */
const MARKER = /\s*(?:#|\/\/|\/\*)?\s*⟦([\w,]+)⟧\s*(?:\*\/)?\s*$/;

export function parseCode(src: string): CodeLine[] {
  const lines = src.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n');
  return lines.map((line) => {
    const m = line.match(MARKER);
    if (!m) return { text: line, points: [] };
    return { text: line.slice(0, m.index), points: m[1].split(',') };
  });
}

/** 目印を消した、そのまま実行できるソース */
export function stripMarkers(src: string): string {
  return parseCode(src)
    .map((l) => l.text)
    .join('\n')
    .concat('\n');
}

export function pointsIn(src: string): Set<string> {
  return new Set(parseCode(src).flatMap((l) => l.points));
}
