import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthPanelProvider, useAuthPanel } from "@/contexts/AuthPanelContext";
import { AuthPanel } from "@/components/auth/AuthPanel";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";

// Core Layout components
import About from "./pages/About";
import Agents from "./pages/Agents";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/**
 * RootRedirect handles the initial redirect from / to /:lang/
 * Uses LanguageProvider to determine the default language
 */
function RootRedirect() {
  const { language } = useLanguage();
  return <Navigate to={`/${language}/`} replace />;
}

/**
 * AppRoutes contains all the language-prefixed routes
 * Structure: /:lang/path (where lang is en, id, nl, es)
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect to language-specific home */}
      <Route path="/" element={<RootRedirect />} />

      {/* Language-prefixed routes */}
      <Route path="/:lang" element={<Index />} />
      <Route path="/:lang/properties" element={<Properties />} />
      <Route path="/:lang/property/:id" element={<PropertyDetail />} />
      <Route path="/:lang/about" element={<About />} />
      <Route path="/:lang/network" element={<Agents />} />
      <Route path="/:lang/intelligence" element={<Blog />} />
      <Route path="/:lang/intelligence/:slug" element={<BlogPost />} />
      <Route path="/:lang/login" element={<Login />} />
      <Route path="/:lang/dashboard" element={<Dashboard />} />
      <Route path="/:lang/account" element={<Account />} />
      <Route path="/:lang/auth/callback" element={<AuthCallback />} />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AuthPanelGlobal() {
  const { isAuthPanelOpen, closeAuthPanel, initialMode } = useAuthPanel();
  const { language } = useLanguage();
  const location = useLocation();

  // Only show global variant on non-home pages
  const isHomePage = location.pathname === `/${language}` || location.pathname === '/' || location.pathname === `/${language}/`;

  if (isHomePage) return null;

  return (
    <AuthPanel
      variant="global"
      isOpen={isAuthPanelOpen}
      onClose={closeAuthPanel}
      initialMode={initialMode}
    />
  );
}

function AppContent() {
  return (
    <AuthPanelProvider>
      <AuthProvider>
        <ScrollToTop />
        <AppRoutes />
        <AuthPanelGlobal />
      </AuthProvider>
    </AuthPanelProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
