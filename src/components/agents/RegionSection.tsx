import { motion } from 'framer-motion';
import type { Agent } from '@/data/mockData';
import { AgentCard } from './AgentCard';

interface RegionSectionProps {
  id: string;
  title: string;
  subtext: string;
  agents: Agent[];
  agentPhotos: Record<string, string>;
}

export const RegionSection = ({ id, title, subtext, agents, agentPhotos }: RegionSectionProps) => {
  if (agents.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-sm font-bold tracking-[0.2em] text-foreground uppercase mb-4">
          {title}
        </h2>
        <div className="w-8 h-px bg-foreground/25 mb-5" />
        <p className="text-muted-foreground text-lg max-w-lg">
          {subtext}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map((agent, index) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            photo={agentPhotos[agent.id] || ''}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};
