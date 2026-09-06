'use client';

import { createContext, useContext } from 'react';
import { translations, type Language } from './translations';
import { FUNNEL } from './funnelCopy';

/**
 * Shared language context so the navbar switcher and page content read one
 * language (previously the landing had its own locked-to-'fr' state — the
 * switcher didn't affect it). AppShell provides the value; pages use useLanguage().
 */
export const LanguageContext = createContext<{ lang: Language; setLang: (l: Language) => void }>({
  lang: 'fr',
  setLang: () => {},
});

export function useLanguage() {
  const { lang, setLang } = useContext(LanguageContext);
  const t = (key: string): string =>
    FUNNEL[lang]?.[key] ?? translations[lang]?.[key] ?? FUNNEL.fr[key] ?? translations.fr[key] ?? key;
  return { lang, setLang, t };
}
