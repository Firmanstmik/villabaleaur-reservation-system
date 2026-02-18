import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export const NetworkModelSection = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      title: t('agents.networkGlobalCoordination'),
      description: t('agents.networkGlobalCoordinationDesc'),
    },
    {
      title: t('agents.networkLocalExpertise'),
      description: t('agents.networkLocalExpertiseDesc'),
    },
    {
      title: t('agents.networkClientRepresentation'),
      description: t('agents.networkClientRepresentationDesc'),
    },
  ];

  return (
    <section className="py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-28 items-start">
          {/* Left column — heading + description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-[2rem] md:text-[2.75rem] font-bold text-foreground leading-[1.15] mb-8">
              {t('agents.networkHeadline')}
            </h2>
            <p className="text-muted-foreground text-lg leading-[1.85] max-w-lg">
              {t('agents.networkDescription')}
            </p>
          </motion.div>

          {/* Right column — three value blocks */}
          <div className="space-y-12">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-sm font-bold tracking-[0.2em] text-foreground uppercase mb-4">
                  {pillar.title}
                </h3>
                <div className="w-8 h-px bg-foreground/25 mb-4" />
                <p className="text-muted-foreground leading-[1.8] max-w-sm">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
