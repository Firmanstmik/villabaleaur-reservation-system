import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { whatsappUrl } from '@/data/mockData';
import logoImage from '@/assets/Ukon-Estate.png';

const footerLinks = {
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/agents' },
    { name: 'Careers', path: '#' },
    { name: 'Contact', path: '#' },
  ],
  services: [
    { name: 'Property Sales', path: '/services' },
    { name: 'Rental Management', path: '/services' },
    { name: 'Investment Consulting', path: '/services' },
    { name: 'Property Valuation', path: '/services' },
  ],
  resources: [
    { name: 'Blog', path: '/blog' },
    { name: 'Market Reports', path: '#' },
    { name: 'Buying Guide', path: '#' },
    { name: 'Selling Guide', path: '#' },
  ],
};

export function Footer() {
  const { language } = useLanguage();

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  // Helper to add language prefix to paths
  const getLocalizedPath = (path: string) => {
    if (path === '#') return path;
    return `/${language}${path}`;
  };

  return (
    <footer className="bg-ukon-navy text-white">
      {/* CTA Section */}
      <div className="py-16 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Where Dreams Come True
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Ready to find your perfect property? Contact us today and let's make it happen together.
            </p>
            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-ukon-red hover:bg-ukon-red/90 text-white glow-effect flex items-center gap-2 mx-auto"
            >
              <span className="blink-dot" />
              Contact Us on WhatsApp
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to={getLocalizedPath('/')} className="inline-block mb-6">
                <img src={logoImage} alt="UKON ESTATE Logo" className="h-16 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-white/70 mb-6 max-w-sm">
                Your trusted partner in real estate. We help you find, sell, and invest in properties that match your dreams.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/70">
                  <MapPin size={18} className="text-ukon-red" />
                  <span>123 Business Avenue, Miami, FL 33101</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Phone size={18} className="text-ukon-red" />
                  <span>+1 (234) 567-890</span>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Mail size={18} className="text-ukon-red" />
                  <span>info@ukonestate.com</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={getLocalizedPath(link.path)}
                      className="text-white/70 hover:text-ukon-red transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={getLocalizedPath(link.path)}
                      className="text-white/70 hover:text-ukon-red transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Resources</h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={getLocalizedPath(link.path)}
                      className="text-white/70 hover:text-ukon-red transition-colors"
                    >
                      {link.name}
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
              © 2024 UKON Estate. All rights reserved.
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
