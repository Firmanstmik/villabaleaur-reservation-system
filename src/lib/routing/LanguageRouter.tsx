import { ReactNode, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';

interface LanguageRouterProps {
  children: ReactNode;
}

/**
 * LanguageRouter wraps BrowserRouter and handles language-prefixed routes
 *
 * Structure:
 * / → detects language → 302 redirect to /:lang/
 * /:lang/* → all routes under language prefix
 *
 * For production server (Nginx/Vercel):
 * Configure 302 redirect at the server level:
 *
 * Nginx:
 * location = / {
 *   set $detected_lang en; # auto-detect server-side if possible
 *   return 302 /$detected_lang$request_uri;
 * }
 *
 * Vercel (vercel.json):
 * {
 *   "redirects": [
 *     { "source": "/", "destination": "/en/", "statusCode": 302 }
 *   ]
 * }
 */

function RootRedirector() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    // Redirect / to /:lang/ with 302 equivalent (navigate)
    navigate(`/${language}/`, { replace: true });
  }, [navigate, language]);

  return null;
}

function LanguageRouteHandler({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { language } = useLanguage();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // If at root, show redirector
  if (location.pathname === '/') {
    return <RootRedirector />;
  }

  // If URL has language prefix, ensure it matches context
  const urlLang = pathSegments[0];
  const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'id', 'nl', 'es'];

  if (!SUPPORTED_LANGUAGES.includes(urlLang as SupportedLanguage)) {
    // Invalid language prefix, redirect to correct one
    return <Navigate to={`/${language}${location.pathname}`} replace />;
  }

  return <>{children}</>;
}

export function LanguageRouterWrapper({ children }: LanguageRouterProps) {
  return (
    <LanguageRouteHandler>
      {children}
    </LanguageRouteHandler>
  );
}

/**
 * Hook to get current language from URL params
 * Throws error if not within LanguageProvider
 */
export function useLanguageParam(): SupportedLanguage {
  const { language } = useLanguage();
  return language;
}

/**
 * Hook to get the base path without language prefix
 * Example: /en/properties → /properties
 */
export function useLocalizedPath(): string {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length > 0) {
    const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'id', 'nl', 'es'];
    if (SUPPORTED_LANGUAGES.includes(pathSegments[0] as SupportedLanguage)) {
      pathSegments.shift();
    }
  }

  return pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '/';
}
