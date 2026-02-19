import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { whatsappUrl } from '@/data/mockData';
import logoImage from '@/assets/Ukon-Estate-icon.png';

interface FooterLink {
  key: string;
  path: string;
  external?: boolean;
  hash?: boolean;
}

const advisoryLinks: FooterLink[] = [
  { key: 'footer.propertySales', path: '/properties' },
  { key: 'footer.investmentAdvisory', path: '/#services', hash: true },
  { key: 'footer.rentalAssetManagement', path: '/#services', hash: true },
  { key: 'footer.propertyValuation', path: 'whatsapp', external: true },
];

const networkLinks: FooterLink[] = [
  { key: 'footer.ourNetwork', path: '/network' },
  { key: 'footer.europeRepresentation', path: '/network#region-europe', hash: true },
  { key: 'footer.southeastAsiaRepresentation', path: '/network#region-southeast-asia', hash: true },
  { key: 'footer.strategicPartnerships', path: '/network' },
  { key: 'footer.joinOurNetwork', path: '/network' },
];

const intelligenceLinks: FooterLink[] = [
  { key: 'footer.marketIntelligence', path: '/intelligence' },
  { key: 'footer.marketReports', path: '/intelligence?category=Market+Report' },
  { key: 'footer.buyingGuides', path: '/intelligence' },
  { key: 'footer.sellingGuides', path: '/intelligence' },
];

const legalLinks: FooterLink[] = [
  { key: 'footer.privacyPolicy', path: '#' },
  { key: 'footer.termsOfUse', path: '#' },
  { key: 'footer.disclaimer', path: '#' },
];

export function Footer() {
  const { language, t } = useLanguage();

  const getLocalizedPath = (path: string) => {
    if (path === '#') return path;
    const [pathname, query] = path.split('?');
    return `/${language}${pathname}${query ? `?${query}` : ''}`;
  };

  const renderLink = (link: FooterLink) => {
    const className = "text-sm text-white/55 hover:text-white/90 transition-colors duration-150";

    if (link.external) {
      return (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {t(link.key)}
        </a>
      );
    }

    if (link.hash) {
      const [pathPart, hashPart] = link.path.split('#');
      const localizedPath = pathPart === '/' ? `/${language}` : `/${language}${pathPart}`;
      return (
        <Link
          to={`${localizedPath}#${hashPart}`}
          className={className}
        >
          {t(link.key)}
        </Link>
      );
    }

    return (
      <Link
        to={getLocalizedPath(link.path)}
        className={className}
      >
        {t(link.key)}
      </Link>
    );
  };

  return (
    <footer className="bg-ukon-navy text-white">
      {/* Primary Footer */}
      <div className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
            {/* Column 1 — Brand */}
            <div>
              <Link to={getLocalizedPath('/')} className="inline-block mb-6">
                <img
                  src={logoImage}
                  alt="Ukon Estate"
                  className="h-20 w-auto object-contain"
                />
              </Link>
              <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
                {t('footer.positioning')}
              </p>
              <div className="space-y-2.5 text-sm text-white/40">
                <p>{t('footer.address')}</p>
                <a
                  href={`mailto:${t('footer.email')}`}
                  className="block hover:text-white/70 transition-colors duration-150"
                >
                  {t('footer.email')}
                </a>
                <a
                  href={`tel:${t('footer.phone').replace(/\s/g, '')}`}
                  className="block hover:text-white/70 transition-colors duration-150"
                >
                  {t('footer.phone')}
                </a>
              </div>
            </div>

            {/* Column 2 — Advisory */}
            <div>
              <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-6">
                {t('footer.advisory')}
              </h4>
              <ul className="space-y-3">
                {advisoryLinks.map((link) => (
                  <li key={link.key}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Global Network */}
            <div>
              <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-6">
                {t('footer.globalNetwork')}
              </h4>
              <ul className="space-y-3">
                {networkLinks.map((link) => (
                  <li key={link.key}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Intelligence */}
            <div>
              <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-white/30 mb-6">
                {t('footer.intelligence')}
              </h4>
              <ul className="space-y-3">
                {intelligenceLinks.map((link) => (
                  <li key={link.key}>{renderLink(link)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-white/8" />
      </div>

      {/* Secondary Footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left — Legal */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/30">
              <span>{t('footer.copyright')}</span>
              {legalLinks.map((link) => (
                <Link
                  key={link.key}
                  to={getLocalizedPath(link.path)}
                  className="hover:text-white/60 transition-colors duration-150"
                >
                  {t(link.key)}
                </Link>
              ))}
            </div>

            {/* Right — Social */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/ukonestate/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white/70 transition-colors duration-150"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://web.facebook.com/Ukonnect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white/70 transition-colors duration-150"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
