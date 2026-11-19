import { useEffect, useMemo, useRef } from 'react';
import type { LangId } from '../algorithms/types';
import { LANGS, parseCode } from '../lib/code';

interface Props {
  code: Record<LangId, string>;
  lang: LangId;
  onLang: (l: LangId) => void;
  point: string | null;
}

export function CodeView({ code, lang, onLang, point }: Props) {
  const lines = useMemo(() => parseCode(code[lang]), [code, lang]);
  const scroller = useRef<HTMLDivElement>(null);

  // 光っている行がコード枠の中で見えるようにスクロール（ページ全体は動かさない）
  useEffect(() => {
    const box = scroller.current;
    const el = box?.querySelector<HTMLElement>('.code-line.hot');
    if (!box || !el) return;
    const top = el.offsetTop - box.offsetTop;
    if (top < box.scrollTop + 8 || top + el.offsetHeight > box.scrollTop + box.clientHeight - 8) {
      box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3), behavior: 'smooth' });
    }
  }, [point, lang]);

  const info = LANGS.find((l) => l.id === lang)!;

  return (
    <div className="code">
      <div className="code-tabs" role="tablist" aria-label="言語">
        {LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={l.id === lang}
            className={l.id === lang ? 'on' : ''}
            onClick={() => onLang(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="code-scroll" ref={scroller} role="tabpanel" aria-label={`${info.label} のコード`}>
        <ol className="code-lines">
          {lines.map((l, i) => {
            const hot = point !== null && l.points.includes(point);
            return (
              <li key={i} className={hot ? 'code-line hot' : 'code-line'} aria-current={hot ? 'step' : undefined}>
                <span className="ln" aria-hidden="true">
                  {i + 1}
                </span>
                <code>{l.text || ' '}</code>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="code-note">
        {info.base === 1
          ? '擬似言語：IPA 基本情報技術者試験（科目B）の記述形式。配列の要素番号は 1 から始まります。'
          : `${info.label}：配列の位置は 0 から始まります。そのまま実行できるサンプルです。`}
      </p>
    </div>
  );
}
