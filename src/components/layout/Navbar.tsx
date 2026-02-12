import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthModal from '@/components/auth/AuthModal';
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
  { key: 'agents', path: '/agents' },
  { key: 'blog', path: '/blog' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();

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
        className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md border-b border-transparent transition-colors duration-300"
        style={{ height: 'auto', padding: '0.8vw 2vw' }}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo Group */}
          <Link
            to={withLang('/')}
            className="flex items-center gap-[0.8vw]"
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
              alt="UKON ESTATE Logo"
              className="h-[3.5vw] w-auto object-contain"
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
                onClick={() => setAuthModalOpen(true)}
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Spacer to push content down - only on non-property pages */}
      {!location.pathname.includes('/property/') && (
        <>
          <div style={{ height: '5vw' }} className="hidden lg:block" />
          <div className="h-20 lg:hidden" />
        </>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden bg-background"
          >
            <div
              className="absolute inset-0 bg-background"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="flex flex-col h-full pt-24 px-6 gap-6 relative z-50">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  to={link.localizedPath}
                  onClick={(e) => {
                    handleNavClick(e, link);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-2xl font-medium"
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Locale Dropdown */}
              <div className="mt-2 pt-4 border-t border-border/30">
                <LocaleDropdown />
              </div>

              {/* Mobile Auth */}
              {!loading && (
                <div className="mt-4 space-y-3">
                  {user ? (
                    <>
                      <UserDropdown />
                      <Button
                        onClick={handleWhatsAppClick}
                        className="w-full bg-[#D92C2C] text-white py-6 text-lg rounded-xl"
                      >
                        {t('navigation.contactUsNow')}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          setAuthModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-ukon-navy text-white py-6 text-lg rounded-xl"
                      >
                        {t('navigation.signIn')}
                      </Button>
                      <Button
                        onClick={handleWhatsAppClick}
                        className="w-full bg-[#D92C2C] text-white py-6 text-lg rounded-xl"
                      >
                        {t('navigation.contactUsNow')}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
