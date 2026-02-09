import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.png';
import heroVideo from '@/assets/hero-video.mp4';
import ginoBeeltPhoto from '@/assets/Gino_Beelt.avif';
import roselynnChaiPhoto from '@/assets/Roselynn_Chai.avif';
import marcoLoureiroPhoto from '@/assets/Marco_Loureiro.avif';
import afifahUkonPhoto from '@/assets/Afifah_Ukon.avif';
import { stats } from '@/data/mockData';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cloneRef = useRef<HTMLVideoElement>(null);
  const [showClone, setShowClone] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const clone = cloneRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
    if (clone) clone.playbackRate = 0.75;

    const FADE_DURATION = 1.5; // seconds before end to start crossfade

    const handleTimeUpdate = () => {
      if (!video.duration || !cloneRef.current) return;
      const timeLeft = video.duration - video.currentTime;

      if (timeLeft <= FADE_DURATION && !showClone) {
        // Start clone at beginning, fade it in
        cloneRef.current.currentTime = 0;
        cloneRef.current.play().catch(() => {});
        setShowClone(true);
      }
    };

    const handleSeeked = () => {
      // Video has looped back to start — hide clone
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

  return (
    <section className="w-full bg-background relative" style={{ padding: '2vh 2vw' }}>
      <div
        className="relative w-full overflow-hidden"
        style={{ height: '85vh', borderRadius: '2.5vw' }}
      >
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
            transition: `opacity ${1.5}s ease-in-out`,
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay — 10% opacity, above video, below content */}
        <div className="absolute inset-0 bg-black/[0.10]" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

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

      </div>

      {/* Google Reviews — edge-locked to hero's bottom-right border */}
      <div
        className="absolute z-20"
        style={{
          bottom: '2vh',
          right: '2vw',
        }}
      >
        <div
          className="bg-background flex items-end"
          style={{
            borderTopLeftRadius: '2.5vw',
            padding: '1.2vw 0.8vw 0.6vw 1.6vw',
            gap: '0.8vw',
          }}
        >
          {/* Avatars */}
          <div className="flex -space-x-[1.2vw]">
            {[
              ginoBeeltPhoto,
              roselynnChaiPhoto,
              marcoLoureiroPhoto,
              afifahUkonPhoto,
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
          <div className="flex flex-col justify-end" style={{ paddingBottom: '0.15vw' }}>
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
    </section>
  );
}
