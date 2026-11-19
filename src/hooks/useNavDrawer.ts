import { useEffect, useState } from 'react';
import { load, save } from '../lib/storage';
import { useMediaQuery } from '../lib/useMediaQuery';

/**
 * 左メニューの開閉。
 * PC では開いた状態から始めて開閉を記憶し、スマホ（幅 900px 以下）では閉じた状態から始めて、
 * 開いたときは画面に重ねて出す（Esc・背景のクリック・項目の選択で閉じる）。
 */
export function useNavDrawer() {
  const narrow = useMediaQuery('(max-width: 900px)');
  const [navPref, setNavPref] = useState(() => load('nav') !== 'closed');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleNav = () => {
    if (narrow) setDrawerOpen((o) => !o);
    else
      setNavPref((o) => {
        save('nav', o ? 'closed' : 'open');
        return !o;
      });
  };
  const closeDrawer = () => setDrawerOpen(false);

  // スマホのメニューは Esc で閉じる
  useEffect(() => {
    if (!(narrow && drawerOpen)) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [narrow, drawerOpen]);

  return {
    narrow,
    navOpen: narrow ? drawerOpen : navPref,
    /** スマホでメニューを重ねて出しているとき */
    drawerShown: narrow && drawerOpen,
    toggleNav,
    closeDrawer,
    /** メニューで選んだあと: スマホならメニューを閉じる */
    closeIfNarrow: () => {
      if (narrow) setDrawerOpen(false);
    },
  };
}
