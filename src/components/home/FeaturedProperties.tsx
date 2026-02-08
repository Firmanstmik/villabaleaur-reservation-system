import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/PropertyCard';
import { properties } from '@/data/mockData';
import { useInView } from '@/hooks/useInView';

export function FeaturedProperties() {
  const { ref, isInView } = useInView();
  const featuredProperties = properties.filter((p) => p.featured).slice(0, 6);

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
            Featured Properties
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground uppercase tracking-wide"
          >
            Discover Homes Tailored to Your<br />Lifestyle and Needs
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
            <Link to="/properties">
              View All Properties
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
