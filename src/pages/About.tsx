import { motion } from 'framer-motion';
import { Target, Eye, CheckCircle, Users, Award, Heart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { whatsappNumber } from '@/data/mockData';
import { useEffect } from 'react';

function StatItem({ value, label, suffix = '', delay = 0 }: { value: number; label: string; suffix?: string; delay?: number }) {
  const { ref, isInView } = useInView({ threshold: 0.5 });
  const { formattedValue, start } = useCountUp({ end: value, suffix, delay });

  useEffect(() => {
    if (isInView) {
      start();
    }
  }, [isInView, start]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-ukon-red mb-2 counter-animate">
        {formattedValue}
      </div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

const values = [
  {
    icon: Heart,
    title: 'Client-Centric',
    description: 'Your needs and dreams are at the heart of everything we do.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every transaction and interaction.',
  },
  {
    icon: Users,
    title: 'Integrity',
    description: 'Honest, transparent, and ethical practices guide our business.',
  },
];

const About = () => {
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
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
              alt="Luxury Property"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ukon-navy via-ukon-navy/90 to-ukon-navy/80" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div ref={ref} className="max-w-3xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium mb-6"
              >
                About Us
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                Building Dreams,
                <br />
                <span className="text-ukon-red">Creating Homes</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/70 text-lg"
              >
                For over 15 years, UKON Estate has been the trusted partner for families, 
                investors, and businesses looking to find their perfect property.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatItem value={15} label="Years Experience" suffix="+" delay={0} />
              <StatItem value={500} label="Properties Sold" suffix="+" delay={100} />
              <StatItem value={200} label="Happy Clients" suffix="+" delay={200} />
              <StatItem value={98} label="Client Satisfaction" suffix="%" delay={300} />
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-2 bg-ukon-red/10 text-ukon-red rounded-full text-sm font-medium mb-4">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  A Legacy of Excellence in Real Estate
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Founded with a passion for helping people find their dream homes, UKON Estate 
                  has grown from a small local agency to one of the most trusted names in real estate. 
                  Our journey has been defined by our commitment to excellence, integrity, and 
                  client satisfaction.
                </p>
                <p className="text-muted-foreground text-lg">
                  Today, we continue to build on our legacy, combining traditional values with 
                  innovative technology to deliver exceptional real estate experiences. Our team 
                  of dedicated professionals brings local expertise and global perspective to 
                  every transaction.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                    alt="UKON Estate Office"
                    className="w-full h-auto"
                  />
                </div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-ukon-red rounded-full flex items-center justify-center">
                      <CheckCircle size={28} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-ukon-navy">15+</div>
                      <div className="text-sm text-muted-foreground">Years of Trust</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border rounded-3xl p-8 md:p-10"
              >
                <div className="w-16 h-16 bg-ukon-red/10 rounded-2xl flex items-center justify-center text-ukon-red mb-6">
                  <Eye size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To be the most trusted and innovative real estate company, transforming how 
                  people discover, buy, sell, and experience properties. We envision a world 
                  where finding your dream home is an exciting, seamless journey.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card border border-border rounded-3xl p-8 md:p-10"
              >
                <div className="w-16 h-16 bg-ukon-red/10 rounded-2xl flex items-center justify-center text-ukon-red mb-6">
                  <Target size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To provide exceptional real estate services through honest guidance, 
                  innovative solutions, and personalized attention. We are committed to 
                  exceeding client expectations while building lasting relationships 
                  based on trust and results.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-ukon-red/10 text-ukon-red rounded-full text-sm font-medium mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                What Drives Us Every Day
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-ukon-red/10 rounded-full flex items-center justify-center text-ukon-red mx-auto mb-6">
                    <value.icon size={36} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-ukon-navy">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Work With Us?
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
                Let's start your real estate journey together. Contact us today!
              </p>
              <Button
                onClick={handleWhatsAppClick}
                size="lg"
                className="bg-ukon-red hover:bg-ukon-red/90 text-white glow-effect flex items-center gap-2 mx-auto"
              >
                <span className="blink-dot" />
                Contact Us Now
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
