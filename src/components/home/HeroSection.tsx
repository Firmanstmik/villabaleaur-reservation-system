import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useAuthPanel } from '@/contexts/AuthPanelContext';
import { AuthPanel } from '@/components/auth/AuthPanel';
import heroBg from '@/assets/Ukon_Estate_Hero.avif';
import heroVideo from '@/assets/Ukon_Estate_hero-video-v2.mp4';
import ginoBeeltPhoto from '@/assets/members/Gino_Beelt.avif';
import roselynnChaiPhoto from '@/assets/members/Roselynn_Chai.avif';
import marcoLoureiroPhoto from '@/assets/members/Marco_Loureiro.avif';
import afifahUkonPhoto from '@/assets/members/Afifah_Ukon.avif';
import { stats } from '@/data/mockData';

// Currency symbols
const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  IDR: 'Rp',
  GBP: '£',
};

// Project value amounts by currency (in millions)
const currencyAmounts: Record<string, number> = {
  USD: 465,
  EUR: 420,
  GBP: 370,
  IDR: 4650,
};

export function HeroSection() {
  const { language, t } = useLanguage();
  const { currency } = useCurrency();
  const { isAuthPanelOpen, closeAuthPanel, initialMode } = useAuthPanel();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Programmatically trigger play as fallback for iOS Safari
  // Retries on canplay to cover Safari's delayed readiness
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => { video.play().catch(() => {}); };
    tryPlay();
    video.addEventListener('canplay', tryPlay, { once: true });
    return () => { video.removeEventListener('canplay', tryPlay); };
  }, []);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <section className="w-full bg-background relative" style={{ padding: isMobile ? '0.5vh 3vw 1.5vh' : '2vh 2vw' }}>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '85vh', borderRadius: isMobile ? '5vw' : '2.5vw' }}
      >
        {/* Background Video — always rendered (mobile + desktop + Safari) */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={heroBg}
          src={heroVideo}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: 'block', transform: 'scale(1.05)' }}
        />

        {/* Dark Overlay — 10% opacity, above video, below content */}
        <div className="absolute inset-0 bg-black/[0.10]" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        {/* Content Container */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-center items-start"
          style={{ paddingLeft: isMobile ? '7vw' : '5vw', paddingRight: isMobile ? '7vw' : undefined, paddingTop: isMobile ? '3vw' : undefined }}
          animate={{
            x: isAuthPanelOpen ? (isMobile ? '0%' : '-6%') : '0%',
            opacity: isAuthPanelOpen ? (isMobile ? 1 : 0.7) : 1,
          }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={`font-bold text-white tracking-tight ${isMobile ? 'leading-[1.2]' : 'leading-[1.05]'}`}
            style={{ fontSize: isMobile ? '7.5vw' : '5.5vw', marginBottom: isMobile ? '5vw' : '1.5vw' }}
          >
            {(() => {
              const parts = t('hero.headline').split('|');
              return parts.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < parts.length - 1 && <br />}
                </span>
              ));
            })()}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/90 font-medium"
            style={{
              fontSize: isMobile ? '3.8vw' : '1.1vw',
              marginBottom: isMobile ? '6vw' : '3vw',
              maxWidth: isMobile ? '85%' : '38vw',
              lineHeight: isMobile ? '1.75' : '1.6'
            }}
          >
            {t('hero.subheadline')}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ marginBottom: isMobile ? '10vw' : '4vw' }}
          >
            <Button
              className="rounded-full bg-white text-black hover:bg-white/90 transition-all border-none flex items-center justify-between group"
              style={{
                height: isMobile ? '48px' : 'auto',
                padding: isMobile ? '8px 10px 8px 24px' : '0.74vw 0.8vw 0.74vw 2vw',
                fontSize: isMobile ? '14px' : '1vw',
                borderRadius: '100vw',
                gap: isMobile ? '12px' : '1vw'
              }}
              asChild
            >
              <Link to={`/${language}/properties`}>
                {t('hero.exploreProperties')}
                <div
                  className="bg-black text-white rounded-full flex items-center justify-center transition-transform group-hover:bg-black/80"
                  style={{ width: isMobile ? '32px' : '2.5vw', height: isMobile ? '32px' : '2.5vw' }}
                >
                  <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" style={{ width: isMobile ? '16px' : '1.2vw', height: isMobile ? '16px' : '1.2vw' }} />
                </div>
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`flex ${isMobile ? 'flex-col items-start' : 'items-start'}`}
            style={{ gap: isMobile ? '6vw' : '4vw' }}
          >
            <div>
              <div className="font-bold text-white leading-none" style={{ fontSize: isMobile ? '9vw' : '3.5vw' }}>628</div>
              <div className={`${isMobile ? 'text-white/60' : 'text-white/80'} font-medium`} style={{ fontSize: isMobile ? '2.8vw' : '0.9vw', marginTop: isMobile ? '1.5vw' : '0.5vw' }}>{t('hero.stats.propertiesTransacted')}</div>
            </div>
            <div>
              <div className="font-bold text-white leading-none" style={{ fontSize: isMobile ? '9vw' : '3.5vw' }}>274</div>
              <div className={`${isMobile ? 'text-white/60' : 'text-white/80'} font-medium`} style={{ fontSize: isMobile ? '2.8vw' : '0.9vw', marginTop: isMobile ? '1.5vw' : '0.5vw' }}>{t('hero.stats.happyClients')}</div>
            </div>
            <div>
              <div className="font-bold text-white leading-none" style={{ fontSize: isMobile ? '9vw' : '3.5vw' }}>{currencySymbols[currency]}{currencyAmounts[currency]}M</div>
              <div className={`${isMobile ? 'text-white/60' : 'text-white/80'} font-medium`} style={{ fontSize: isMobile ? '2.8vw' : '0.9vw', marginTop: isMobile ? '1.5vw' : '0.5vw' }}>{t('hero.stats.projectValue')}</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Auth Panel - Hero Variant */}
        <AuthPanel
          variant="hero"
          isOpen={isAuthPanelOpen}
          onClose={closeAuthPanel}
          initialMode={initialMode}
        />
      </div>

      {/* Google Reviews — edge-locked to hero's bottom-right border */}
      <div
        className="absolute z-20"
        style={{
          bottom: isMobile ? '1.5vh' : '2vh',
          right: isMobile ? '3vw' : '2vw',
        }}
      >
        <div
          className="bg-background flex items-end"
          style={{
            borderTopLeftRadius: isMobile ? '4vw' : '2.5vw',
            padding: isMobile ? '2.5vw 2.5vw 1.5vw 3vw' : '1.2vw 0.8vw 0.6vw 1.6vw',
            gap: isMobile ? '2vw' : '0.8vw',
          }}
        >
          {/* Avatars */}
          <div className={`flex ${isMobile ? '-space-x-[2vw]' : '-space-x-[1.2vw]'}`}>
            {[
              ginoBeeltPhoto,
              roselynnChaiPhoto,
              marcoLoureiroPhoto,
              afifahUkonPhoto,
            ].map((src, i) => (
              <div
                key={i}
                className={`rounded-full border-background overflow-hidden relative z-0 ${isMobile ? 'border-[0.5vw]' : 'border-[0.25vw]'}`}
                style={{
                  width: isMobile ? '7vw' : '4.2vw',
                  height: isMobile ? '7vw' : '4.2vw',
                  zIndex: 10 - i
                }}
              >
                <img src={src} alt="Reviewer" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Text */}
          <div className="flex flex-col justify-end" style={{ paddingBottom: '0.15vw' }}>
            <span className="font-medium text-muted-foreground leading-none" style={{ fontSize: isMobile ? '2.6vw' : '1vw' }}>
              {t('hero.stats.googleReviews')}
            </span>
            <div className="flex items-center leading-none" style={{ gap: isMobile ? '1vw' : '0.4vw', marginTop: isMobile ? '1vw' : '0.4vw' }}>
              <div className="flex" style={{ gap: isMobile ? '0.2vw' : '0.1vw' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-amber-400 text-amber-400" style={{ width: isMobile ? '3vw' : '1.1vw', height: isMobile ? '3vw' : '1.1vw' }} />
                ))}
              </div>
              <span className="text-foreground font-bold" style={{ fontSize: isMobile ? '3vw' : '1.1vw' }}>{t('hero.stats.rating')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
