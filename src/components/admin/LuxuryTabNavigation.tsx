import { motion } from 'framer-motion';

export type Tab = 'basic' | 'details' | 'media' | 'amenities' | 'performance';

interface LuxuryTabNavigationProps {
  tabs: { id: Tab; label: string }[];
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function LuxuryTabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: LuxuryTabNavigationProps) {
  return (
    <div className="border-b border-border bg-white">
      <div className="flex items-center justify-start max-w-5xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-8 py-4 text-[11px] font-medium uppercase tracking-wider transition-colors duration-150 ${
              activeTab === tab.id
                ? 'text-[#0e2e50] font-semibold'
                : 'text-muted-foreground hover:text-[#0e2e50]/70'
            }`}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-8 right-8 h-px bg-[#0e2e50]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
