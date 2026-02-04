import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { agents } from '@/data/mockData';
import { useInView } from '@/hooks/useInView';

export function AgentsCarousel() {
  const { ref, isInView } = useInView();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div ref={ref} className="flex items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 bg-ukon-red/10 text-ukon-red rounded-full text-sm font-medium mb-4"
            >
              Our Team
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
            >
              Meet Our Expert Agents
            </motion.h2>
          </div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center gap-3"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full border-2 hover:bg-ukon-red hover:border-ukon-red hover:text-white"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full border-2 hover:bg-ukon-red hover:border-ukon-red hover:text-white"
            >
              <ChevronRight size={20} />
            </Button>
          </motion.div>
        </div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 snap-start"
            >
              <motion.div
                whileHover={{ y: -8 }}
                className="w-72 bg-card border border-border rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] image-zoom">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Button
                      size="sm"
                      className="w-full bg-ukon-red hover:bg-ukon-red/90 text-white"
                    >
                      Contact Agent
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-ukon-red transition-colors">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <MapPin size={14} className="text-ukon-red" />
                    <span className="text-sm">{agent.location}</span>
                  </div>
                  <div className="text-sm text-ukon-red mt-2 font-medium">
                    {agent.specialty}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
