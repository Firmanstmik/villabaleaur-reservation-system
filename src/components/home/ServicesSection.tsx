import { motion } from 'framer-motion';
import { Store, Handshake, KeyRound, TrendingUp, SlidersHorizontal, Settings } from 'lucide-react';
import { services } from '@/data/mockData';
import { useInView } from '@/hooks/useInView';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap: Record<string, React.ReactNode> = {
  Home: <Store size={22} strokeWidth={1.5} />,
  Users: <Handshake size={22} strokeWidth={1.5} />,
  Key: <KeyRound size={22} strokeWidth={1.5} />,
  TrendingUp: <TrendingUp size={22} strokeWidth={1.5} />,
  BarChart: <SlidersHorizontal size={22} strokeWidth={1.5} />,
  Settings: <Settings size={22} strokeWidth={1.5} />,
};

export function ServicesSection() {
  const { ref, isInView } = useInView();
  const { t } = useLanguage();

  return (
    <section id="services" className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Header */}
        <div ref={ref} className="text-center mb-14 lg:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-5 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 mb-5"
          >
            {t('services.whatWeDo')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-3xl lg:text-[2.6rem] font-bold text-[#111827] uppercase leading-tight tracking-tight"
          >
            {t('services.exploreOurRange')}
          </motion.h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#f3f3f3] rounded-[20px] p-8 lg:p-10 flex flex-col"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-[#e5e5e5] rounded-full flex items-center justify-center text-[#111827] mb-8">
                {iconMap[service.icon]}
              </div>

              {/* Content */}
              <h3 className="text-lg lg:text-xl font-bold text-[#111827] mb-3">
                {service.title}
              </h3>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
