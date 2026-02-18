import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { FilterBar } from '@/components/properties/FilterBar';
import { properties as mockProperties } from '@/data/mockData';
import { useInView } from '@/hooks/useInView';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFilters } from '@/hooks/useFilters';
import { supabase } from '@/lib/supabase';
import heroBg from '@/assets/Ukon_Estate_Hero.webp';
import heroVideo from '@/assets/Ukon_Estate_hero-video.mp4';

const Properties = () => {
  const { ref, isInView } = useInView();
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cloneRef = useRef<HTMLVideoElement>(null);
  const [showClone, setShowClone] = useState(false);
  const [displayProperties, setDisplayProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const propertiesToDisplay = (data && data.length > 0) ? data : mockProperties;

        // Normalize data structures (Supabase snake_case -> App camelCase)
        const normalized = propertiesToDisplay.map(p => ({
          ...p,
          image: p.image_url || p.image,
          sqft: p.m2 || p.sqft || 0,
          priceType: p.price_type || p.priceType,
          isUkonAgent: p.is_ukon_agent || p.isUkonAgent,
          buildingArea: p.building_area || p.buildingArea,
          surfaceArea: p.surface_area || p.surfaceArea,
          yearBuilt: p.year_built || p.yearBuilt,
          listingCode: p.listing_code || p.listingCode,
          nearbyAmenities: p.nearby_amenities || p.nearbyAmenities
        }));

        setDisplayProperties(normalized);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setDisplayProperties(mockProperties);
      }
    };

    fetchProperties();
  }, []);

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
        cloneRef.current.play().catch(() => { });
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

  // Initialize filters and get filtered results
  const { filters, setFilter, resetFilters, filteredProperties, activeFilterCount } =
    useFilters(displayProperties);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative py-36 md:py-44 overflow-hidden">
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
            <div ref={ref} className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                {t('properties.findYourPerfect')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white/70 text-lg max-w-2xl mx-auto"
              >
                {t('properties.browseDescription')}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Premium Filter Bar */}
        <section className="relative z-20 py-8 bg-card border-b border-border/20">
          <div className="container mx-auto px-4">
            <FilterBar
              filters={filters}
              setFilter={setFilter}
              resetFilters={resetFilters}
              activeFilterCount={activeFilterCount}
              resultCount={filteredProperties.length}
            />
          </div>
        </section>

        {/* Properties Grid */}
        <section className="relative z-0 pt-8 pb-16">
          <div className="container mx-auto px-4">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground text-lg">
                  {t('properties.noPropertiesFound')}
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
