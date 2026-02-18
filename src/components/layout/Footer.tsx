import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logoImage from '@/assets/Ukon-Estate.png';

const footerLinksKeys = {
  company: [
    { key: 'footer.aboutUs', path: '/about' },
    { key: 'footer.ourTeam', path: '/network' },
    { key: 'footer.careers', path: '#' },
    { key: 'footer.contact', path: '#' },
  ],
  services: [
    { key: 'footer.propertySales', path: '/services' },
    { key: 'footer.rentalManagement', path: '/services' },
    { key: 'footer.investmentConsulting', path: '/services' },
    { key: 'footer.propertyValuation', path: '/services' },
  ],
  resources: [
    { key: 'footer.blog', path: '/intelligence' },
    { key: 'footer.marketReports', path: '/intelligence?category=Market+Report' },
    { key: 'footer.buyingGuide', path: '/intelligence' },
    { key: 'footer.sellingGuide', path: '/intelligence' },
  ],
};

export function Footer() {
  const { language, t } = useLanguage();

  // Helper to add language prefix to paths
  const getLocalizedPath = (path: string) => {
    if (path === '#') return path;
    const [pathname, query] = path.split('?');
    return `/${language}${pathname}${query ? `?${query}` : ''}`;
  };

  return (
    <footer className="bg-ukon-navy text-white">
      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to={getLocalizedPath('/')} className="inline-block mb-6">
                <img src={logoImage} alt="Ukon Estate Logo" className="h-16 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-white/70 mb-6 max-w-sm">
                {t('footer.trustedPartner')}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/70">
                  <MapPin size={18} className="text-ukon-red" />
                  <span>{t('footer.address')}</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Phone size={18} className="text-ukon-red" />
                  <span>{t('footer.phone')}</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Mail size={18} className="text-ukon-red" />
                  <span>{t('footer.email')}</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('footer.company')}</h4>
              <ul className="space-y-3">
                {footerLinksKeys.company.map((link) => (
                  <li key={link.key}>
                    <Link
                      to={getLocalizedPath(link.path)}
                      className="text-white/70 hover:text-ukon-red transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('footer.services')}</h4>
              <ul className="space-y-3">
                {footerLinksKeys.services.map((link) => (
                  <li key={link.key}>
                    <Link
                      to={getLocalizedPath(link.path)}
                      className="text-white/70 hover:text-ukon-red transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('footer.resources')}</h4>
              <ul className="space-y-3">
                {footerLinksKeys.resources.map((link) => (
                  <li key={link.key}>
                    <Link
                      to={getLocalizedPath(link.path)}
                      className="text-white/70 hover:text-ukon-red transition-colors"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                whileHover={{ scale: 1.2, color: 'hsl(var(--ukon-red))' }}
                href="#"
                className="text-white/50 transition-colors"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: 'hsl(var(--ukon-red))' }}
                href="#"
                className="text-white/50 transition-colors"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: 'hsl(var(--ukon-red))' }}
                href="#"
                className="text-white/50 transition-colors"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: 'hsl(var(--ukon-red))' }}
                href="#"
                className="text-white/50 transition-colors"
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
