'use client';

import React, { createContext, useContext } from 'react';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { translations, Language } from '../lib/i18n';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.ru;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const language = (params.lang as Language) || 'ru';

  const setLanguage = (lang: Language) => {
    // Replace the current language in the URL with the new one
    if (!pathname) return;
    
    // Pathname looks like /ru/auctions, we want to replace the first segment
    const segments = pathname.split('/');
    if (segments.length >= 2 && ['ru', 'en', 'zh'].includes(segments[1])) {
      segments[1] = lang;
      const newPath = segments.join('/');
      router.push(newPath);
    } else {
      router.push(`/${lang}${pathname}`);
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
