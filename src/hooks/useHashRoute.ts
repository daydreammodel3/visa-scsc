import { useEffect, useState } from 'react';
import { parseHash } from '../lib/route';

/** URL のハッシュから表示する内容を決める。ブラウザの戻る・進むや、ハッシュの書き換えにも追従する */
export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return [route, setRoute] as const;
}

/** いまの表示を URL のハッシュに書き戻す（共有用。履歴は増やさない） */
export function useSyncHash(hash: string) {
  useEffect(() => {
    if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
  }, [hash]);
}
