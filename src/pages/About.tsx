import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, CheckCircle, Users, Award, Heart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { whatsappUrl } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import heroBg from '@/assets/hero-bg.png';
import heroVideo from '@/assets/hero-video.mp4';

function StatItem({ value, label, suffix = '', delay = 0 }: { value: number; label: string; suffix?: string; delay?: number }) {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const { formattedValue, start } = useCountUp({ end: value, suffix, delay });

  useEffect(() => {
    if (isInView) {
      start();
    }
  }, [isInView, start]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-ukon-red mb-2 counter-animate">
        {formattedValue}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

const About = () => {
  const { ref, isInView } = useInView();
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cloneRef = useRef<HTMLVideoElement>(null);
  const [showClone, setShowClone] = useState(false);

  const values = [
    {
      icon: Heart,
      title: t('about.clientCentric'),
      description: t('about.clientCentricDescription'),
    },
    {
      icon: Award,
      title: t('about.excellence'),
      description: t('about.excellenceDescription'),
    },
    {
      icon: Users,
      title: t('about.integrity'),
      description: t('about.integrityDescription'),
    },
  ];

  useEffect(() => {
    const video = videoRef.current;
    const clone = cloneRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
    if (clone) clone.playbackRate = 0.75;

    const FADE_DURATION = 1.5;

    const handleTimeUpdate = () => {
      if (!video.duration || !cloneRef.current) return;
      const timeLeft = video.duration - video.currentTime;

      if (timeLeft <= FADE_DURATION && !showClone) {
        cloneRef.current.currentTime = 0;
        cloneRef.current.play().catch(() => {});
        setShowClone(true);
      }
    };

    const handleSeeked = () => {
      if (video.currentTime < FADE_DURATION) {
        setShowClone(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [showClone]);

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background Video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={heroBg}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: 'block', transform: 'scale(1.05)' }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>

          {/* Clone video for crossfade at loop boundary */}
          <video
            ref={cloneRef}
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
              display: 'block',
              transform: 'scale(1.05)',
              opacity: showClone ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/[0.10]" />
          <div className="absolute inset-0 bg-black/40" />

          <div className="container mx-auto px-4 relative z-10">
            <div ref={ref} className="max-w-3xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6"
              >
                {t('navigation.about')}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                {t('about.buildingDreams')}
                <br />
                <span className="text-ukon-red">{t('about.creatingHomes')}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/70 text-lg"
              >
                {t('about.longDescription')}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem value={15} label={t('about.yearsExperience')} suffix="+" delay={0} />
              <StatItem value={500} label={t('about.propertiesSold')} suffix="+" delay={100} />
              <StatItem value={200} label={t('hero.stats.happyClients')} suffix="+" delay={200} />
              <StatItem value={98} label={t('about.clientSatisfaction')} suffix="%" delay={300} />
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 bg-ukon-red/10 text-ukon-red rounded-full text-sm font-medium mb-4">
                  {t('about.pageSubheadline')}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {t('about.pageTitle')}
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  {t('about.foundedDescription')}
                </p>
                <p className="text-muted-foreground text-lg">
                  {t('about.todayDescription')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                    alt="UKON Estate Office"
                    className="w-full h-auto"
                  />
                </div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-ukon-red rounded-full flex items-center justify-center">
                      <CheckCircle size={28} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-ukon-navy">15+</div>
                      <div className="text-sm text-muted-foreground">{t('about.pageHeadline')}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border rounded-3xl p-8 md:p-10"
              >
                <div className="w-16 h-16 bg-ukon-red/10 rounded-2xl flex items-center justify-center text-ukon-red mb-6">
                  <Eye size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('about.ourVision')}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('about.visionLongStatement')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card border border-border rounded-3xl p-8 md:p-10"
              >
                <div className="w-16 h-16 bg-ukon-red/10 rounded-2xl flex items-center justify-center text-ukon-red mb-6">
                  <Target size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('about.ourMission')}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('about.missionLongStatement')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-ukon-red/10 text-ukon-red rounded-full text-sm font-medium mb-4">
                {t('about.ourValues')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t('about.whatDrivesUs')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-ukon-red/10 rounded-full flex items-center justify-center text-ukon-red mx-auto mb-6">
                    <value.icon size={36} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-ukon-navy">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {t('about.readyToWorkWithUs')}
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
                {t('about.letStartJourney')}
              </p>
              <Button
                onClick={handleWhatsAppClick}
                size="lg"
                className="bg-ukon-red hover:bg-ukon-red/90 text-white glow-effect flex items-center gap-2 mx-auto"
              >
                <span className="blink-dot" />
                {t('navigation.contactUsNow')}
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
