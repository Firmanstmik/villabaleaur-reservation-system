import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { Agent } from '@/data/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

interface AgentCardProps {
  agent: Agent;
  photo: string;
  index: number;
}

export const AgentCard = ({ agent, photo, index }: AgentCardProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group cursor-pointer"
    >
      <div className="bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={photo || agent.photo}
            alt={agent.name}
            className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.12] transition-colors duration-200" />

          {/* View Profile — bottom-left text */}
          <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-white/90 text-sm tracking-wide">
              {t('agents.viewProfile')} →
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Name — strongest element */}
          <h3 className="text-xl font-bold text-foreground mb-2">
            {agent.name}
          </h3>

          {/* Location — muted, smaller */}
          <div className="flex items-center gap-1.5 text-muted-foreground/70 mb-4">
            <MapPin size={13} className="text-muted-foreground/50 shrink-0" />
            <span className="text-[13px]">{agent.location}</span>
          </div>

          {/* Market Focus — uppercase label */}
          <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground/40 font-medium mb-4">
            {agent.specialty}
          </p>

          {/* Metadata — smallest, most receded */}
          {(agent.experience || agent.languages) && (
            <div className="pt-4 border-t border-border/40 space-y-2">
              {agent.experience && (
                <p className="text-[11px] text-muted-foreground/40">
                  {agent.experience} local experience
                </p>
              )}
              {agent.languages && (
                <p className="text-[11px] text-muted-foreground/40">
                  {agent.languages}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
