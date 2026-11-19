/** 画面の固定文言 */
export const UI = {
  title: 'アルゴリズムずかん',
  subtitle: '基本情報技術者試験・科目Bのアルゴリズムを、1ステップずつ可視化',
  pickAlgorithm: 'アルゴリズムを選択',
  openMenu: 'メニューを開く',
  closeMenu: 'メニューを閉じる',
  first: '最初',
  prev: '戻る',
  play: '自動再生',
  pause: '停止',
  replay: 'もう一度',
  next: '進む',
  last: '最後',
  stepUnit: 'ステップ',
  slider: 'ステップ位置',
  speedGroup: '再生速度',
  speeds: { slow: '遅い', normal: '標準', fast: '速い' },
  toolbar: 'ステップ操作',
} as const;

/** 難しさの表示 */
export const LEVEL_LABEL: Record<1 | 2 | 3, string> = {
  1: '入門',
  2: '中級',
  3: '上級',
};
