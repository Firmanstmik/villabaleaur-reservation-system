import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { whatsappNumber } from '@/data/mockData';
import logoImage from '@/assets/Ukon-Estate.png';

const navLinks = [
  { name: 'Home', path: '/', scrollTo: 'top' },
  { name: 'Services', path: '/', scrollTo: 'services' },
  { name: 'Properties', path: '/properties' },
  { name: 'About', path: '/about' },
  { name: 'Agents', path: '/agents' },
  { name: 'Blog', path: '/blog' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`, '_blank');
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
        if (location.pathname !== '/') {
          window.location.href = '/';
        } else {
          scrollToTop();
        }
      } else {
        // Scroll to section
        if (location.pathname !== '/') {
          // Navigate to home first, then scroll
          window.location.href = `/#${link.scrollTo}`;
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
    return location.pathname === link.path;
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm"
        style={{ height: 'auto', padding: '0.8vw 2vw' }}
      >
        <div className="w-full flex items-center justify-between">
          {/* Logo Group */}
          <Link
            to="/"
            className="flex items-center gap-[0.8vw]"
            onClick={(e) => {
              if (location.pathname === '/') {
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
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link)}
                className={`font-medium transition-colors hover:text-[#D92C2C] ${isLinkActive(link) ? 'text-[#D92C2C]' : 'text-foreground'
                  }`}
                style={{ fontSize: '0.9vw' }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <Button
              onClick={handleWhatsAppClick}
              className="rounded-full bg-[#D92C2C] text-white hover:bg-[#D92C2C]/90 transition-all border-none flex items-center justify-between group"
              style={{
                height: 'auto',
                padding: '0.6vw 0.6vw 0.6vw 1.5vw',
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
                <span className="font-medium">Contact Us Now</span>
              </div>

              <div
                className="bg-white text-[#D92C2C] rounded-full flex items-center justify-center transition-transform group-hover:bg-white/90"
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
      </header>

      {/* Spacer to push content down - matches header height approximately */}
      {/* On desktop, ~3.8vw height + padding. On mobile, ~60px */}
      <div style={{ height: '3.8vw' }} className="hidden lg:block" />
      <div className="h-15 lg:hidden" />

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
                  key={link.path}
                  to={link.path}
                  onClick={(e) => {
                    handleNavClick(e, link);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-2xl font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4">
                <Button onClick={handleWhatsAppClick} className="w-full bg-[#D92C2C] text-white py-6 text-lg rounded-xl">
                  Contact Us Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
