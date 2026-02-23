import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useTransition, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export type SupportedLanguage = 'en' | 'id' | 'nl' | 'es';

export interface LanguageContextType {
  language: SupportedLanguage;
  translations: Record<string, any>;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key?: string) => string;
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

// Resolve a dot-notation key against a translations object
function resolveKey(key: string, obj: Record<string, any>): string | undefined {
  const value = key.split('.').reduce<any>((acc, part) => acc?.[part], obj);
  return typeof value === 'string' ? value : undefined;
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

  // Cache English translations for fallback
  const enFallbackRef = useRef<Record<string, any>>({});

  // Load translations on mount and language change
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);

      // Always ensure English fallback is loaded
      if (Object.keys(enFallbackRef.current).length === 0) {
        enFallbackRef.current = await loadTranslations('en');
      }

      const trans = language === 'en'
        ? enFallbackRef.current
        : await loadTranslations(language);

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

  // Translation function: active locale → English fallback → raw key
  const t = (key?: string): string => {
    if (typeof key !== 'string') return '';

    // Try active locale first
    const value = resolveKey(key, translations);
    if (value !== undefined) return value;

    // Fallback to English
    const fallback = resolveKey(key, enFallbackRef.current);
    if (fallback !== undefined) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] Missing "${language}" translation for: ${key}`);
      }
      return fallback;
    }

    // Last resort: return the key itself
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[i18n] Missing translation key in all locales: ${key}`);
    }
    return key;
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

  // Block render until translations are loaded to prevent raw key flash
  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

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
