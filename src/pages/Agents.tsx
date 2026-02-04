import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { agents, whatsappNumber } from '@/data/mockData';
import { useInView } from '@/hooks/useInView';

const Agents = () => {
  const { ref, isInView } = useInView();

  const handleContactAgent = (agentName: string) => {
    const message = encodeURIComponent(`Hi, I'd like to connect with ${agentName} from UKON Estate.`);
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-ukon-navy">
          <div className="container mx-auto px-4">
            <div ref={ref} className="text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6"
              >
                Our Team
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                Meet Our Expert Agents
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/70 text-lg max-w-2xl mx-auto"
              >
                Our dedicated team of real estate professionals is ready to help you find your dream property.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Agents Grid */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-ukon-red/30">
                    {/* Image */}
                    <div className="relative aspect-[4/5] image-zoom">
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Overlay Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex gap-3 mb-4">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white cursor-pointer"
                          >
                            <Phone size={18} />
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white cursor-pointer"
                          >
                            <Mail size={18} />
                          </motion.div>
                        </div>
                        <Button
                          onClick={() => handleContactAgent(agent.name)}
                          className="w-full bg-ukon-red hover:bg-ukon-red/90 text-white"
                        >
                          Contact Agent
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-ukon-red transition-colors mb-2">
                        {agent.name}
                      </h3>
                      <div className="flex items-center gap-1 text-muted-foreground mb-3">
                        <MapPin size={16} className="text-ukon-red" />
                        <span className="text-sm">{agent.location}</span>
                      </div>
                      <div className="inline-block px-3 py-1 bg-ukon-red/10 text-ukon-red text-sm font-medium rounded-full">
                        {agent.specialty}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Team CTA */}
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Join Our Team
                </h2>
                <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
                  Are you passionate about real estate? We're always looking for talented professionals to join our growing team.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-ukon-navy hover:bg-white/90"
                >
                  View Career Opportunities
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

export default Agents;
