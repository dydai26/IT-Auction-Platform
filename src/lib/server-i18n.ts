import { cookies } from 'next/headers';
import { translations, Language } from './i18n';

export async function getServerTranslations(lang: string) {
  const language = (lang as Language) || 'ru';
  
  return {
    t: translations[language] || translations.ru,
    language
  };
}
