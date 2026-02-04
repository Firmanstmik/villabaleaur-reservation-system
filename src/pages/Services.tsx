import { motion } from 'framer-motion';
import { Home, Users, Key, TrendingUp, BarChart, Settings, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { services, whatsappNumber } from '@/data/mockData';
import { useInView } from '@/hooks/useInView';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home size={40} />,
  Users: <Users size={40} />,
  Key: <Key size={40} />,
  TrendingUp: <TrendingUp size={40} />,
  BarChart: <BarChart size={40} />,
  Settings: <Settings size={40} />,
};

const Services = () => {
  const { ref, isInView } = useInView();

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-ukon-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-ukon-red rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div ref={ref} className="text-center max-w-3xl mx-auto">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6"
              >
                Our Services
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                Comprehensive Real Estate Solutions
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/70 text-lg"
              >
                From buying and selling to property management and investment consulting, 
                we offer a full range of services to meet all your real estate needs.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:border-ukon-red/50 relative overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-ukon-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-20 h-20 bg-ukon-red/10 rounded-2xl flex items-center justify-center text-ukon-red mb-6 group-hover:bg-ukon-red group-hover:text-white transition-all duration-300"
                      >
                        {iconMap[service.icon]}
                      </motion.div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-ukon-red transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {/* Learn More Link */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-ukon-red font-medium group-hover:gap-4 transition-all"
                      >
                        Learn More
                        <ArrowRight size={18} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-ukon-navy rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ukon-red rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
                  Contact us today to discuss your real estate needs and discover how we can help you achieve your goals.
                </p>
                <Button
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="bg-ukon-red hover:bg-ukon-red/90 text-white glow-effect flex items-center gap-2 mx-auto"
                >
                  <span className="blink-dot" />
                  Contact Us on WhatsApp
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
