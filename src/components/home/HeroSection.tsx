import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { stats, whatsappNumber } from '@/data/mockData';
import { useEffect } from 'react';

function StatCounter({ end, suffix, label, delay }: { end: number; suffix: string; label: string; delay: number }) {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const { formattedValue, start } = useCountUp({ end, suffix, delay });

  useEffect(() => {
    if (isInView) {
      start();
    }
  }, [isInView, start]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white counter-animate">
        {formattedValue}
      </div>
      <div className="text-white/70 mt-2">{label}</div>
    </div>
  );
}

export function HeroSection() {
  const { ref, isInView } = useInView();

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`, '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div ref={ref} className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              WHERE DREAMS
              <br />
              <span className="text-ukon-red">COME TRUE</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Discover exceptional properties and make your real estate dreams a reality with UKON Estate's expert guidance and personalized service.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              onClick={handleWhatsAppClick}
              size="lg"
              className="bg-ukon-red hover:bg-ukon-red/90 text-white glow-effect flex items-center gap-2 px-8 py-6 text-lg"
            >
              <span className="blink-dot" />
              Contact Us Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-ukon-navy px-8 py-6 text-lg"
              asChild
            >
              <a href="/properties">
                View Properties
                <ArrowRight className="ml-2" size={20} />
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <StatCounter end={stats.projects} suffix="+" label="Projects" delay={0} />
            <StatCounter end={stats.clients} suffix="+" label="Happy Clients" delay={200} />
            <StatCounter end={stats.value} suffix="M+" label="Value Sold" delay={400} />
          </motion.div>
        </div>

        {/* Floating Google Reviews Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-20 right-8 hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="bg-white rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"
                  alt="Customer"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                  alt="Customer"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
                  alt="Customer"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">4.9</span> on Google
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
