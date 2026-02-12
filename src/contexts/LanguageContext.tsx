import React, { createContext, useContext, useEffect, useMemo, useState, useTransition, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export type SupportedLanguage = 'en' | 'id' | 'nl' | 'es';

export interface LanguageContextType {
  language: SupportedLanguage;
  translations: Record<string, any>;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  isLoading: boolean;
  isPending: boolean;
  availableLanguages: SupportedLanguage[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'id', 'nl', 'es'];
const STORAGE_KEY = 'ukon_language_preference';

// Lazy load translation files
async function loadTranslations(lang: SupportedLanguage): Promise<Record<string, any>> {
  try {
    const module = await import(`@/lib/i18n/translations/${lang}.json`);
    return module.default;
  } catch (error) {
    console.warn(`Failed to load translations for ${lang}, falling back to English`, error);
    if (lang !== 'en') {
      return loadTranslations('en');
    }
    return {};
  }
}

// Auto-detect language from browser
function detectLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') return 'en';

  const browserLang = navigator.language.split('-')[0].toLowerCase();

  if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }

  return 'en';
}

// Get language from URL, localStorage, or detection
function resolveLanguage(urlLang: string | undefined): SupportedLanguage {
  // 1. Priority: URL parameter (authoritative)
  if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang as SupportedLanguage)) {
    return urlLang as SupportedLanguage;
  }

  // 2. Priority: localStorage preference
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }

  // 3. Priority: browser detection
  return detectLanguage();
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const params = useParams<{ lang?: string }>();
  const navigate = useNavigate();

  const urlLang = params.lang;
  const [language, setLanguageState] = useState<SupportedLanguage>(() =>
    resolveLanguage(urlLang)
  );
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Load translations on mount and language change
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      const trans = await loadTranslations(language);
      if (isMounted) {
        setTranslations(trans);
        setIsLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [language]);

  // Sync URL language to state (URL is authoritative)
  useEffect(() => {
    const resolvedLang = resolveLanguage(urlLang);

    if (resolvedLang !== language) {
      startTransition(() => {
        setLanguageState(resolvedLang);
      });
    }
  }, [urlLang, language]);

  // Handle language change: update both state and URL
  const handleSetLanguage = (newLang: SupportedLanguage) => {
    if (newLang === language) return;

    // Save preference to localStorage
    localStorage.setItem(STORAGE_KEY, newLang);

    startTransition(() => {
      setLanguageState(newLang);

      // Update URL to match new language
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/').filter(Boolean);

      // Remove old language prefix if it exists
      if (SUPPORTED_LANGUAGES.includes(pathSegments[0] as SupportedLanguage)) {
        pathSegments[0] = newLang;
      } else {
        pathSegments.unshift(newLang);
      }

      navigate(`/${pathSegments.join('/')}`);
    });
  };

  // Translation function with dot notation support
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // If key not found in current language, return the key as fallback
        // (Do not recurse to avoid infinite loops)
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<LanguageContextType>(() => ({
    language,
    translations,
    setLanguage: handleSetLanguage,
    t,
    isLoading,
    isPending,
    availableLanguages: SUPPORTED_LANGUAGES,
  }), [language, translations, isLoading, isPending]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
