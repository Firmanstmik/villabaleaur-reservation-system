import { motion } from 'framer-motion';
import { Home, Users, Key, TrendingUp, BarChart, Settings } from 'lucide-react';
import { services } from '@/data/mockData';
import { useInView } from '@/hooks/useInView';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home size={32} />,
  Users: <Users size={32} />,
  Key: <Key size={32} />,
  TrendingUp: <TrendingUp size={32} />,
  BarChart: <BarChart size={32} />,
  Settings: <Settings size={32} />,
};

export function ServicesSection() {
  const { ref, isInView } = useInView();

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-ukon-red/10 text-ukon-red rounded-full text-sm font-medium mb-4"
          >
            What We Offer
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Comprehensive real estate services tailored to meet all your property needs.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-card border border-border rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:border-ukon-red/30">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-ukon-red/10 rounded-2xl flex items-center justify-center text-ukon-red mb-6 group-hover:bg-ukon-red group-hover:text-white transition-colors duration-300"
                >
                  {iconMap[service.icon]}
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-ukon-red transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
