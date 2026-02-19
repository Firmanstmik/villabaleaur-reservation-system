import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthPanel } from '@/contexts/AuthPanelContext';
import UserDropdown from '@/components/layout/UserDropdown';
import { LocaleDropdown } from '@/components/layout/LocaleDropdown';
import { whatsappUrl } from '@/data/mockData';
import logoImage from '@/assets/Ukon-Estate.png';

// Navigation links configuration (without language prefix - added dynamically)
const navLinksConfig = [
  { key: 'home', path: '/', scrollTo: 'top' },
  { key: 'services', path: '/', scrollTo: 'services' },
  { key: 'properties', path: '/properties' },
  { key: 'about', path: '/about' },
  { key: 'agents', path: '/network' },
  { key: 'blog', path: '/intelligence' },
];

// AuthPanel hero variant background — reused for mobile menu
const mobileMenuBg = `linear-gradient(135deg, rgba(250, 249, 246, 0.95) 0%, rgba(253, 252, 251, 0.95) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`;

const primaryKeys = ['home', 'properties', 'agents'];
const secondaryKeys = ['services', 'blog', 'about'];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();
  const { toggleAuthPanel } = useAuthPanel();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Helper to build language-prefixed paths
  const withLang = (path: string): string => {
    return `/${language}${path}`;
  };

  // Extract language prefix and base path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const basePathSegments = pathSegments.slice(1); // Remove language prefix
  const basePath = basePathSegments.length > 0 ? `/${basePathSegments.join('/')}` : '/';

  // Build nav links with language prefix and translation names
  const navLinks = navLinksConfig.map((link) => ({
    ...link,
    name: t(`navigation.${link.key}`),
    localizedPath: withLang(link.path),
  }));

  const primaryLinks = navLinks.filter(l => primaryKeys.includes(l.key));
  const secondaryLinks = navLinks.filter(l => secondaryKeys.includes(l.key));

  // ESC to close + focus management for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      setTimeout(() => closeButtonRef.current?.focus(), 100);
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMobileMenuOpen(false);
      };
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    } else {
      menuButtonRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Always show at top
        if (currentScrollY < 10) {
          setIsVisible(true);
          setLastScrollY(currentScrollY);
          return;
        }

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    // Handle hash-based scrolling on page load
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 100);
    }
  }, []);

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.scrollTo) {
      e.preventDefault();

      if (link.scrollTo === 'top') {
        // Scroll to top
        if (basePath !== '/') {
          window.location.href = withLang('/');
        } else {
          scrollToTop();
        }
      } else {
        // Scroll to section
        if (basePath !== '/') {
          // Navigate to home first, then scroll
          window.location.href = `${withLang('/')}#${link.scrollTo}`;
        } else {
          // Already on home, just scroll
          scrollToSection(link.scrollTo);
        }
      }
    }
  };

  const isLinkActive = (link: typeof navLinks[0]) => {
    // For links with scrollTo, don't mark them as active based on path
    // Only Home should be active on the homepage
    if (link.scrollTo && link.scrollTo !== 'top') {
      return false;
    }
    return basePath === link.path;
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-transparent transition-colors duration-300 py-3 px-4 lg:py-[0.8vw] lg:px-[2vw]"
        style={{ height: 'auto' }}
      >
        <div className="w-full flex items-center justify-between relative">
          {/* Logo Group — absolute-centered on mobile, normal flow on desktop */}
          <Link
            to={withLang('/')}
            className="flex items-center gap-[0.8vw] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0"
            onClick={(e) => {
              if (basePath === '/') {
                e.preventDefault();
                scrollToTop();
              }
            }}
          >
            {/* Logo Image */}
            <img
              src={logoImage}
              alt="Ukon Estate Logo"
              className="h-10 max-h-10 lg:h-[3.5vw] lg:max-h-none w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center" style={{ gap: '2.5vw' }}>
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.localizedPath}
                onClick={(e) => handleNavClick(e, link)}
                className={`font-medium transition-colors hover:text-[#D92C2C] ${isLinkActive(link) ? 'text-[#D92C2C]' : 'text-foreground'
                  }`}
                style={{ fontSize: '0.9vw' }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button & Auth & Globe */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Auth Button / Avatar */}
            {loading ? null : user ? (
              <UserDropdown />
            ) : (
              <Button
                onClick={() => toggleAuthPanel('login')}
                variant="ghost"
                className="text-foreground hover:text-[#0e2e50] transition-colors font-medium"
                style={{ fontSize: '0.9vw' }}
              >
                {t('navigation.signIn')}
              </Button>
            )}

            {/* Globe Dropdown */}
            <LocaleDropdown />

            <Button
              onClick={handleWhatsAppClick}
              className="rounded-full bg-[#0e2e50] text-white hover:bg-[#0e2e50]/90 transition-all border-none flex items-center justify-between group"
              style={{
                height: 'auto',
                padding: '0.56vw 0.6vw 0.56vw 1.5vw',
                fontSize: '0.9vw',
                borderRadius: '100vw',
                gap: '0.8vw'
              }}
            >
              <div className="flex items-center gap-[0.5vw]">
                {/* Blinking Dot */}
                <div className="relative flex items-center justify-center" style={{ width: '0.6vw', height: '0.6vw' }}>
                  <div className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <div className="relative inline-flex rounded-full bg-green-500 w-full h-full" />
                </div>
                <span className="font-medium">{t('navigation.contact')}</span>
              </div>

              <div
                className="bg-white text-[#0e2e50] rounded-full flex items-center justify-center transition-transform group-hover:bg-white/90"
                style={{ width: '2.2vw', height: '2.2vw' }}
              >
                <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" style={{ width: '1.1vw', height: '1.1vw' }} />
              </div>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 shrink-0 flex items-center justify-center text-foreground ml-auto"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Spacer to push content down - only on non-property pages */}
      {!location.pathname.includes('/property/') && (
        <>
          <div style={{ height: 'calc(3.5vw + 1.6vw)' }} className="hidden lg:block" />
          <div className="h-16 lg:hidden" />
        </>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 lg:hidden bg-black/30 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in Panel */}
            <motion.div
              key="mobile-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[90vw] backdrop-blur-lg overflow-y-auto lg:hidden"
              style={{
                background: mobileMenuBg,
                borderTopLeftRadius: '24px',
                borderBottomLeftRadius: '24px',
              }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <Link
                  to={withLang('/')}
                  onClick={(e) => {
                    if (basePath === '/') {
                      e.preventDefault();
                      scrollToTop();
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <img src={logoImage} alt="Ukon Estate Logo" className="h-10 w-auto object-contain" />
                </Link>
                <button
                  ref={closeButtonRef}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-[#0e2e50]"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col px-6 pt-6">
                {/* Primary Links */}
                <div className="flex flex-col" style={{ gap: '20px' }}>
                  {primaryLinks.map((link, index) => (
                    <motion.div
                      key={link.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.25, ease: 'easeOut' }}
                    >
                      <Link
                        to={link.localizedPath}
                        onClick={(e) => {
                          handleNavClick(e, link);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-lg font-medium text-[#0e2e50] block"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Secondary Links */}
                <div className="flex flex-col mt-6" style={{ gap: '16px' }}>
                  {secondaryLinks.map((link, index) => (
                    <motion.div
                      key={link.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (primaryLinks.length + index) * 0.04, duration: 0.25, ease: 'easeOut' }}
                    >
                      <Link
                        to={link.localizedPath}
                        onClick={(e) => {
                          handleNavClick(e, link);
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-base font-medium text-[#0e2e50]/85 block"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* Bottom Section */}
              <div className="px-6 mt-8">
                <div className="border-t border-black/10" />

                {/* Utility Row: Sign In + Globe */}
                <div className="flex items-center justify-between pt-4">
                  {!loading && (
                    <div>
                      {user ? (
                        <UserDropdown />
                      ) : (
                        <button
                          onClick={() => {
                            toggleAuthPanel('login');
                            setIsMobileMenuOpen(false);
                          }}
                          className="text-base font-medium text-[#0e2e50]/70"
                        >
                          {t('navigation.signIn')}
                        </button>
                      )}
                    </div>
                  )}
                  <div className="w-8 h-8 rounded-full border border-[#0e2e50]/15 flex items-center justify-center">
                    <LocaleDropdown />
                  </div>
                </div>

                {/* Contact CTA */}
                <Button
                  onClick={() => {
                    handleWhatsAppClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full rounded-full bg-[#0e2e50] text-white hover:bg-[#0e2e50]/90 transition-all border-none flex items-center justify-between group mt-5"
                  style={{
                    height: '48px',
                    padding: '8px 10px 8px 24px',
                    fontSize: '15px',
                    borderRadius: '100vw',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center w-2 h-2">
                      <div className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                      <div className="relative inline-flex rounded-full bg-green-500 w-full h-full" />
                    </div>
                    <span className="font-medium">{t('navigation.contact')}</span>
                  </div>
                  <div className="bg-white text-[#0e2e50] rounded-full w-8 h-8 flex items-center justify-center transition-transform group-hover:bg-white/90">
                    <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" size={16} />
                  </div>
                </Button>

                {/* Bottom spacing */}
                <div className="pb-8" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
