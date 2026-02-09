import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.png';
import { stats } from '@/data/mockData';

export function HeroSection() {
  return (
    <section className="w-full bg-background relative" style={{ padding: '2vh 2vw' }}>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '85vh', borderRadius: '2.5vw' }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-center items-start" style={{ paddingLeft: '5vw' }}>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-bold text-white leading-[1.05] tracking-tight"
            style={{ fontSize: '5.5vw', marginBottom: '1.5vw' }}
          >
            WHERE DREAMS<br />COME TRUE.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/90 font-medium"
            style={{
              fontSize: '1.1vw',
              marginBottom: '3vw',
              maxWidth: '38vw',
              lineHeight: '1.6'
            }}
          >
            We provide tailored real estate solutions, guiding you through every step with personalized experiences that meet your unique needs and aspirations.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ marginBottom: '4vw' }}
          >
            <Button
              className="rounded-full bg-white text-black hover:bg-white/90 transition-all border-none flex items-center justify-between group"
              style={{
                height: 'auto',
                padding: '0.8vw 0.8vw 0.8vw 2vw',
                fontSize: '1vw',
                borderRadius: '100vw',
                gap: '1vw'
              }}
              asChild
            >
              <Link to="/properties">
                Explore Properties
                <div
                  className="bg-black text-white rounded-full flex items-center justify-center transition-transform group-hover:bg-black/80"
                  style={{ width: '2.5vw', height: '2.5vw' }}
                >
                  <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" style={{ width: '1.2vw', height: '1.2vw' }} />
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
            className="flex items-start"
            style={{ gap: '4vw' }}
          >
            <div>
              <div className="font-bold text-white leading-none" style={{ fontSize: '3.5vw' }}>{stats.projects}+</div>
              <div className="text-white/80 font-medium mt-[0.5vw]" style={{ fontSize: '0.9vw' }}>Projects Complete</div>
            </div>
            <div>
              <div className="font-bold text-white leading-none" style={{ fontSize: '3.5vw' }}>{stats.clients}+</div>
              <div className="text-white/80 font-medium mt-[0.5vw]" style={{ fontSize: '0.9vw' }}>Happy Clients</div>
            </div>
            <div>
              <div className="font-bold text-white leading-none" style={{ fontSize: '3.5vw' }}>${stats.value}M+</div>
              <div className="text-white/80 font-medium mt-[0.5vw]" style={{ fontSize: '0.9vw' }}>Project Value</div>
            </div>
          </motion.div>
        </div>

        {/* Google Reviews Overlay (The Fluid Cutout) */}
        {/* This div sits on top of the image to create the 'cutout' effect */}
        <div
          className="absolute bottom-0 right-0 bg-background flex items-center justify-center z-20"
          style={{
            width: 'auto', // Let content define width + padding
            minWidth: '28vw',
            height: '10vh', // Reduced height further
            borderTopLeftRadius: '4vw', // Increased radius for smoother curve
            padding: '0 2vw 0 1.5vw' // Adjusted padding: no top/bottom, balanced sides
          }}
        >
          <div className="flex items-center justify-center h-full" style={{ gap: '1.2vw' }}>
            {/* Avatars */}
            <div className="flex -space-x-[1.2vw]">
              {[
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
              ].map((src, i) => (
                <div
                  key={i}
                  className="rounded-full border-[0.25vw] border-background overflow-hidden relative z-0"
                  style={{
                    width: '4.2vw',
                    height: '4.2vw',
                    zIndex: 10 - i
                  }}
                >
                  <img src={src} alt="Reviewer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center h-full" style={{ paddingTop: '0.5vw' }}>
              <span className="font-medium text-muted-foreground leading-none" style={{ fontSize: '1vw' }}>
                47+ Google Reviews
              </span>
              <div className="flex items-center mt-[0.4vw] leading-none" style={{ gap: '0.4vw' }}>
                <div className="flex gap-[0.1vw]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-amber-400 text-amber-400" style={{ width: '1.1vw', height: '1.1vw' }} />
                  ))}
                </div>
                <span className="text-foreground font-bold" style={{ fontSize: '1.1vw' }}>4.8 / 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
