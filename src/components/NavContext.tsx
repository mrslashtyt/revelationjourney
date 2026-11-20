import { createContext, useContext, useEffect, useState } from 'react';

export type PageId = 'home' | 'explorer' | 'eras' | 'timeline' | 'map' | 'quiz' | 'learn' | 'askai' | 'progress';

interface NavContextValue {
  page: PageId;
  navigate: (page: PageId) => void;
}

const NavContext = createContext<NavContextValue>({ page: 'home', navigate: () => {} });

export function useNav() {
  return useContext(NavContext);
}

function pageFromHash(): PageId {
  const hash = window.location.hash.replace('#', '').split('/')[0];
  const valid: PageId[] = ['home', 'explorer', 'eras', 'timeline', 'map', 'quiz', 'learn', 'askai', 'progress'];
  return (valid.includes(hash as PageId) ? hash : 'home') as PageId;
}

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<PageId>(pageFromHash);

  const navigate = (next: PageId) => {
    window.location.hash = next;
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return <NavContext.Provider value={{ page, navigate }}>{children}</NavContext.Provider>;
}
