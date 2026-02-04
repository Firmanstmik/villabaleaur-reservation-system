import { motion } from 'framer-motion';
import { Target, Eye, CheckCircle } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
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

export function AboutSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-24 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div ref={ref}>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-block px-4 py-2 bg-ukon-red/10 text-ukon-red rounded-full text-sm font-medium mb-4"
            >
              About UKON Estate
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
            >
              Building Dreams,
              <br />
              <span className="text-ukon-red">Creating Homes</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg mb-8"
            >
              With years of experience in the real estate industry, UKON Estate has
              helped countless families find their perfect homes. Our dedicated team
              combines local expertise with global vision to deliver exceptional results.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-6 mb-10"
            >
              <StatItem value={15} label="Years Experience" suffix="+" delay={0} />
              <StatItem value={500} label="Properties Sold" suffix="+" delay={200} />
              <StatItem value={98} label="Client Satisfaction" suffix="%" delay={400} />
            </motion.div>

            {/* Vision & Mission Cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-ukon-red/10 rounded-xl flex items-center justify-center text-ukon-red mb-4">
                  <Eye size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Our Vision</h3>
                <p className="text-muted-foreground text-sm">
                  To be the most trusted real estate partner, transforming how people
                  find and experience their dream properties.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-12 h-12 bg-ukon-red/10 rounded-xl flex items-center justify-center text-ukon-red mb-4">
                  <Target size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
                <p className="text-muted-foreground text-sm">
                  To provide exceptional service, honest guidance, and innovative
                  solutions that exceed client expectations.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                alt="Luxury Property"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              animate={{ y: [0, -10, 0] }}
              className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-ukon-red rounded-full flex items-center justify-center">
                  <CheckCircle size={28} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-ukon-navy">100%</div>
                  <div className="text-sm text-muted-foreground">Trusted Service</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
