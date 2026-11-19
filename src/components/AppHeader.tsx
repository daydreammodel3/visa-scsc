import { UI } from '../lib/text';
import { NumBuddy } from './NumBuddy';

interface Props {
  navOpen: boolean;
  onToggleNav: () => void;
}

/** 画面上部: メニューの開閉ボタンとサイト名 */
export function AppHeader({ navOpen, onToggleNav }: Props) {
  const navLabel = navOpen ? UI.closeMenu : UI.openMenu;
  return (
    <header className="top">
      <button
        type="button"
        className={navOpen ? 'hamburger open' : 'hamburger'}
        aria-expanded={navOpen}
        aria-controls="sidenav"
        aria-label={navLabel}
        title={navLabel}
        onClick={onToggleNav}
      >
        <span />
        <span />
        <span />
      </button>
      <div className="brand">
        <NumBuddy size={52} value={null} color="#ffd43b" guide />
        <div>
          <h1>{UI.title}</h1>
          <p>{UI.subtitle}</p>
        </div>
      </div>
    </header>
  );
}
