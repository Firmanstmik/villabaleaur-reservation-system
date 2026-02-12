import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/PropertyCard';
import { properties as mockProperties } from '@/data/mockData';
import { useInView } from '@/hooks/useInView';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

export function FeaturedProperties() {
  const { ref, isInView } = useInView();
  const { language, t } = useLanguage();
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

        // Normalize
        const normalized = propertiesToDisplay.map(p => ({
          ...p,
          image: p.image_url || p.image,
          sqft: p.m2 || p.sqft || 0,
          priceType: p.price_type || p.priceType,
          isUkonAgent: p.is_ukon_agent || p.isUkonAgent,
        }));

        setDisplayProperties(normalized);
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setDisplayProperties(mockProperties);
      }
    };

    fetchProperties();
  }, []);

  const featuredProperties = useMemo(() => {
    // If we have real properties from the database, use them (marked with featured: true or just take the first 6)
    const hasRealData = displayProperties.some(p => !mockProperties.find(mp => mp.id === p.id));

    if (hasRealData) {
      // Show real properties that are marked as featured, or if none are featured, show the most recent ones
      const featured = displayProperties.filter((p) => p.featured);
      if (featured.length > 0) {
        return featured.slice(0, 6);
      }
      // If no properties are explicitly marked as featured, show the most recent real properties
      return displayProperties.slice(0, 6);
    }

    // Otherwise use the mock data that has featured flag set
    return displayProperties.filter((p) => p.featured).slice(0, 6);
  }, [displayProperties]);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div ref={ref} className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-secondary text-muted-foreground rounded-full text-sm font-medium mb-6"
          >
            {t('properties.featured')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground uppercase tracking-wide"
          >
            {t('properties.featuredSubtitle')}
          </motion.h2>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            asChild
            size="lg"
            className="bg-ukon-navy hover:bg-ukon-navy/90 text-white"
          >
            <Link to={`/${language}/properties`}>
              {t('properties.viewAllProperties')}
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
