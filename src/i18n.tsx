import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'ru' | 'en';
/** A string in both site languages. */
export type L = Record<Lang, string>;

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'ru', setLang: () => {} });

function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem('lang');
    if (v === 'ru' || v === 'en') return v;
  } catch { /* storage unavailable */ }
  return navigator.language?.startsWith('ru') ? 'ru' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem('lang', lang); } catch { /* storage unavailable */ }
  }, [lang]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  const t = (s: L) => s[lang];
  return { lang, setLang, t };
}
