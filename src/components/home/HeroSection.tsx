import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { stats } from '@/data/mockData';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.png';
function StatCounter({
  end,
  suffix,
  label,
  delay
}: {
  end: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const {
    ref,
    isInView
  } = useInView({
    threshold: 0.5
  });
  const {
    formattedValue,
    start
  } = useCountUp({
    end,
    suffix,
    delay
  });
  useEffect(() => {
    if (isInView) {
      start();
    }
  }, [isInView, start]);
  return <div ref={ref} className="text-left">
      <div className="text-3xl md:text-4xl font-bold text-white counter-animate">
        {formattedValue}
      </div>
      <div className="text-white/70 text-sm mt-1">{label}</div>
    </div>;
}
export function HeroSection() {
  const {
    ref,
    isInView
  } = useInView();
  return <section className="pt-2 pb-8 px-4 md:px-8 bg-background">
      <div className="container mx-auto">
        {/* Hero Card Container */}
        <div className="relative">
          {/* Main Hero Image Container with custom shape */}
          <div className="relative w-full h-[500px] md:h-[600px] rounded-3xl overflow-visible">
            {/* Background Image with clip-path for cutout */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 100px), calc(100% - 320px) calc(100% - 100px), calc(100% - 320px) 100%, 0 100%)'
          }}>
              <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
              backgroundImage: `url(${heroBg})`
            }}>
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              </div>
            </div>

            {/* Content - Left Aligned */}
            <div ref={ref} className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-2xl">
              {/* Animated Title */}
              <motion.div initial={{
              opacity: 0,
              y: 50
            }} animate={isInView ? {
              opacity: 1,
              y: 0
            } : {}} transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight italic">
                  WHERE DREAMS
                  <br />
                  COME TRUE.
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p initial={{
              opacity: 0,
              y: 30
            }} animate={isInView ? {
              opacity: 1,
              y: 0
            } : {}} transition={{
              duration: 0.8,
              delay: 0.2
            }} className="text-base md:text-lg text-white/80 mb-8 max-w-md">
                We provide tailored real estate solutions, guiding you through every step with personalized experiences that meet your unique needs and aspirations.
              </motion.p>

              {/* CTA Button */}
              <motion.div initial={{
              opacity: 0,
              y: 30
            }} animate={isInView ? {
              opacity: 1,
              y: 0
            } : {}} transition={{
              duration: 0.8,
              delay: 0.4
            }} className="mb-12">
                <Button variant="outline" size="lg" className="border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-foreground rounded-full px-8 py-6 text-base" asChild>
                  <Link to="/properties">
                    Explore Properties
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{
              opacity: 0,
              y: 40
            }} animate={isInView ? {
              opacity: 1,
              y: 0
            } : {}} transition={{
              duration: 0.8,
              delay: 0.6
            }} className="flex gap-8 md:gap-12">
                <StatCounter end={stats.projects} suffix="+" label="Projects Complete" delay={0} />
                <StatCounter end={stats.clients} suffix="+" label="Happy Clients" delay={200} />
                <StatCounter end={stats.value} suffix="M+" label="Project Value" delay={400} />
              </motion.div>
            </div>
          </div>

          {/* Google Reviews Badge - Positioned in the cutout */}
          
        </div>
      </div>
    </section>;
}