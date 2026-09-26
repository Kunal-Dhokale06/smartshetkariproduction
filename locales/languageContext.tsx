import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './en.json';
import mr from './mr.json';
import hi from './hi.json';

export type Language = 'en' | 'mr' | 'hi';

export type TranslationKey = keyof typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en,
  mr,
  hi,
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

const STORAGE_KEY = '@smartshetkari_user_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load stored language preference from AsyncStorage on startup
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'mr' || saved === 'en' || saved === 'hi') {
          setLanguageState(saved);
        }
      })
      .catch((err) => {
        console.warn('[LanguageProvider] Error reading language from storage:', err);
      });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch((err) => {
      console.warn('[LanguageProvider] Error saving language to storage:', err);
    });
  };

  const t = (key: TranslationKey): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
