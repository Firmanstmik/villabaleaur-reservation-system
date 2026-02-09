import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { agents } from '@/data/mockData';
import ginoBeeltPhoto from '@/assets/Gino_Beelt.avif';
import pakKumisPhoto from '@/assets/Pak_Kumis.avif';
import paulWenninkPhoto from '@/assets/Paul_Wennink.avif';
import raffyUkonPhoto from '@/assets/Raffy_Ukon.avif';
import roselynnChainPhoto from '@/assets/Roselynn_Chain.avif';
import marcoLoureiroPhoto from '@/assets/Marco_Loureiro.avif';
import jeroenEgbersPhoto from '@/assets/Jeroen_Egbers.avif';
import hendrikUkonPhoto from '@/assets/Hendrik_Ukon.avif';
import afifahUkonPhoto from '@/assets/Afifah_Ukon.avif';

const agentPhotos: Record<string, string> = {
  '1': ginoBeeltPhoto,
  '2': pakKumisPhoto,
  '3': paulWenninkPhoto,
  '4': raffyUkonPhoto,
  '5': roselynnChainPhoto,
  '6': marcoLoureiroPhoto,
  '7': jeroenEgbersPhoto,
  '8': hendrikUkonPhoto,
  '9': afifahUkonPhoto,
};

export function AgentsCarousel() {
  // Duplicate agents to create a seamless loop
  // We need enough copies to fill the screen + buffer for the animation loop
  const duplicatedAgents = [...agents, ...agents, ...agents, ...agents];

  return (
    <section className="py-24 bg-background overflow-hidden w-full relative">
      <div className="container mx-auto px-4 mb-12 text-center">
        <span className="inline-block px-4 py-2 bg-ukon-red/10 text-ukon-red rounded-full text-sm font-medium mb-4">
          Our Team
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          Meet Our Expert Agents
        </h2>
      </div>

      {/* 
        Full-width Infinite Slider 
        - Edge-to-edge (no side padding on container)
        - Seamless loop
      */}
      <div className="w-full overflow-hidden">
        <motion.div
          className="flex gap-6 w-max pl-6"
          animate={{ x: ["0%", "-25%"] }} // Move by 1/4 (since we have 4 sets, this loops the first set)
          transition={{
            ease: "linear",
            duration: 30, // Adjust speed as needed
            repeat: Infinity,
          }}
          style={{ willChange: 'transform' }} // Optimization
        // Drag support (basic) - pauses on hover typically, but here we just allow simple interaction if needed
        // drag="x"
        // dragConstraints={{ left: -1000, right: 0 }}
        >
          {duplicatedAgents.map((agent, index) => (
            <div
              key={`${agent.id}-${index}`}
              className="relative flex-shrink-0"
              style={{ width: '19vw', minWidth: '260px', maxWidth: '340px' }} // Slightly smaller
            >
              {/* Image Container - Updated to 801x788 ratio */}
              <div
                className="relative w-full overflow-hidden mb-4"
                style={{
                  borderRadius: '1.5rem',
                  aspectRatio: '801/1000' // Taller ratio
                }}
              >
                <img
                  src={agentPhotos[agent.id] || agent.photo}
                  alt={agent.name}
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500 hover:scale-105"
                  draggable={false}
                />
              </div>

              {/* Text Content - Image 2 Style (Simple, Below Image) + Location Icon from Current */}
              <div className="flex flex-col items-start px-2">
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {agent.name}
                </h3>

                {/* Location - Using exact style from current-hero-agents (Mock/Previous) */}
                <div className="flex items-center gap-1.5 text-muted-foreground mt-1.5">
                  <MapPin size={14} className="text-ukon-red fill-current" />
                  <span className="text-sm font-medium">{agent.location}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
