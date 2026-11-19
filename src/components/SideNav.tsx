import type { Category } from '../algorithms';
import { LEVEL_LABEL } from '../lib/text';

interface Props {
  id: string;
  categories: Category[];
  currentId: string;
  label: string;
  onSelect: (id: string) => void;
  onClose?: () => void;
  closeLabel: string;
  compareActive: boolean;
  onCompare: () => void;
}

export function SideNav({ id, categories, currentId, label, onSelect, onClose, closeLabel, compareActive, onCompare }: Props) {
  return (
    <nav id={id} className="sidenav" aria-label={label}>
      {onClose && (
        <button type="button" className="nav-close" onClick={onClose} aria-label={closeLabel}>
          ×
        </button>
      )}
      {categories.map((c) => (
        <div className="nav-group" key={c.name}>
          <h2 className="nav-heading">{c.name}</h2>
          <ul>
            {c.items.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className={a.id === currentId ? 'nav-item on' : 'nav-item'}
                  aria-current={a.id === currentId ? 'page' : undefined}
                  onClick={() => onSelect(a.id)}
                >
                  <span className="nav-name">{a.name}</span>
                  <span className={`nav-level lv${a.level}`}>{LEVEL_LABEL[a.level]}</span>
                </button>
              </li>
            ))}
            {c.name === '整列' && (
              <li>
                <button
                  type="button"
                  className={compareActive ? 'nav-item nav-compare on' : 'nav-item nav-compare'}
                  aria-current={compareActive ? 'page' : undefined}
                  onClick={onCompare}
                >
                  <span className="nav-name">⇄ ソートの比較</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      ))}
      <p className="nav-more">ほかのアルゴリズムも順次追加予定</p>
    </nav>
  );
}
