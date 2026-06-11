import { ru } from './locales/ru';
import { en } from './locales/en';
import { zh } from './locales/zh';

export type Language = 'ru' | 'en' | 'zh';

export const translations = {
  ru,
  en,
  zh,
};
// Trigger TS re-eval

