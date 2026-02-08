import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { stats } from '@/data/mockData';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.png';

function StatCounter({ end, suffix, label, delay }: { end: number; suffix: string; label: string; delay: number }) {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const { formattedValue, start } = useCountUp({ end, suffix, delay });

  useEffect(() => {
    if (isInView) {
      start();
    }
  }, [isInView, start]);

  return (
    <div ref={ref} className="text-left">
      <div className="text-3xl md:text-4xl font-bold text-white counter-animate">
        {formattedValue}
      </div>
      <div className="text-white/70 text-sm mt-1">{label}</div>
    </div>
  );
}

export function HeroSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="pt-2 pb-8 px-4 md:px-8 bg-background">
      <div className="container mx-auto">
        {/* Hero Card Container */}
        <div className="relative">
          {/* Main Hero Image Container with custom shape */}
          <div
            className="relative w-full h-[500px] md:h-[560px] overflow-visible"
            style={{ borderRadius: '24px' }}
          >
            {/* Background Image with clip-path for cutout */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: '24px',
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 90px), calc(100% - 380px) calc(100% - 90px), calc(100% - 380px) 100%, 0 100%)',
              }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${heroBg})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              </div>
            </div>

            {/* Content - Left Aligned */}
            <div ref={ref} className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
              {/* Animated Title - NOT italic, bold uppercase */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                  WHERE DREAMS
                  <br />
                  COME TRUE.
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base md:text-lg text-white/80 mb-8 max-w-md"
              >
                We provide tailored real estate solutions, guiding you through every step with personalized experiences that meet your unique needs and aspirations.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mb-12"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-foreground rounded-full px-8 py-6 text-base"
                  asChild
                >
                  <Link to="/properties">
                    Explore Properties
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex gap-8 md:gap-12"
              >
                <StatCounter end={stats.projects} suffix="+" label="Projects Complete" delay={0} />
                <StatCounter end={stats.clients} suffix="+" label="Happy Clients" delay={200} />
                <StatCounter end={stats.value} suffix="M+" label="Project Value" delay={400} />
              </motion.div>
            </div>
          </div>

          {/* Google Reviews Badge - Positioned in the cutout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute bottom-0 right-0 hidden md:flex items-end"
            style={{ height: '90px', width: '380px' }}
          >
            {/* White curved background that creates the cutout effect */}
            <div 
              className="bg-background h-full w-full flex items-center justify-end pr-4"
              style={{
                borderTopLeftRadius: '24px',
              }}
            >
              <div className="flex items-center gap-4">
                {/* Avatar stack */}
                <div className="flex -space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                    alt="Customer"
                    className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                    alt="Customer"
                    className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
                    alt="Customer"
                    className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
                    alt="Customer"
                    className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  />
                </div>
                {/* Text content */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                    47+ Google Reviews
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1.5">4.8 / 5</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
