import { createContext, useContext, useState } from 'react';
import ru from '../i18n/ru';
import kk from '../i18n/kk';
import en from '../i18n/en';

const DICTS = { ru, kk, en };
const LANGS = [
  { code: 'kk', label: 'ҚАЗ' },
  { code: 'ru', label: 'РУС' },
  { code: 'en', label: 'ENG' },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem('tap_language') || 'en'
  );

  const changeLang = (code) => {
    localStorage.setItem('tap_language', code);
    setLang(code);
  };

  const t = DICTS[lang] || DICTS.ru;

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t, LANGS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
