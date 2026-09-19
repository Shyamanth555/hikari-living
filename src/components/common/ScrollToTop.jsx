import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }

    // The target element may not exist yet if the page is still loading its
    // data (e.g. a product fetch), so poll briefly instead of giving up.
    let attempts = 0;
    const id = hash.slice(1);
    const interval = setInterval(() => {
      const el = document.getElementById(id);
      attempts += 1;
      if (el) {
        el.scrollIntoView();
        clearInterval(interval);
      } else if (attempts > 20) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pathname, hash]);

  return null;
}
