import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { properties } from '@/data/mockData';
import { useInView } from '@/hooks/useInView';

type FilterType = 'all' | 'rent' | 'sale';

const Properties = () => {
  const { ref, isInView } = useInView();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesFilter = filter === 'all' || property.status === filter || 
        (filter === 'sale' && property.status === 'investment');
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-ukon-navy">
          <div className="container mx-auto px-4">
            <div ref={ref} className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                Find Your Perfect Property
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-white/70 text-lg max-w-2xl mx-auto"
              >
                Browse our exclusive collection of properties for sale, rent, and investment opportunities.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-12 bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Search */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full md:w-96"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-full border-2 focus:border-ukon-red"
                />
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
                  <TabsList className="bg-card border border-border">
                    <TabsTrigger 
                      value="all"
                      className="data-[state=active]:bg-ukon-red data-[state=active]:text-white"
                    >
                      All Properties
                    </TabsTrigger>
                    <TabsTrigger 
                      value="rent"
                      className="data-[state=active]:bg-ukon-red data-[state=active]:text-white"
                    >
                      For Rent
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sale"
                      className="data-[state=active]:bg-ukon-red data-[state=active]:text-white"
                    >
                      For Sale
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-16">
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
                  No properties found matching your criteria.
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
