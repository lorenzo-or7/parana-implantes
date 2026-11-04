import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'pi-theme';

interface ThemeValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

function readInitial(): Theme {
  // O script inline do index.html já aplicou o tema certo antes da pintura.
  const current = document.documentElement.dataset.theme;
  return current === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readInitial);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#2A1A0E' : '#FFF3E7');
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* armazenamento indisponível: o tema vale só nesta visita */
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme precisa do ThemeProvider');
  return ctx;
}
