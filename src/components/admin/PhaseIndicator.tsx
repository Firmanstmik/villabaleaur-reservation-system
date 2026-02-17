import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface Phase {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface PhaseIndicatorProps {
  phases: Phase[];
  currentPhaseId: string;
  onPhaseChange: (phaseId: string) => void;
  showLabel?: boolean;
}

export function PhaseIndicator({
  phases,
  currentPhaseId,
  onPhaseChange,
  showLabel = true,
}: PhaseIndicatorProps) {
  const currentIndex = phases.findIndex((p) => p.id === currentPhaseId);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Phase Icons Container */}
      <div className="flex items-center gap-3">
        {phases.map((phase, index) => {
          const isActive = phase.id === currentPhaseId;
          const isCompleted = index < currentIndex;
          const Icon = phase.icon;

          return (
            <div key={phase.id} className="flex items-center gap-3">
              {/* Phase Circle */}
              <motion.button
                onClick={() => {
                  // Allow navigation to current, previous, and next phases
                  if (index <= currentIndex + 1) {
                    onPhaseChange(phase.id);
                  }
                }}
                disabled={index > currentIndex + 1}
                className={`relative flex items-center justify-center transition-all ${
                  index > currentIndex + 1 ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-[#0e2e50]/12 shadow-[0_1px_2px_rgba(14,46,80,0.08)]'
                        : isCompleted
                          ? 'bg-[#0e2e50]/8'
                          : 'bg-muted'
                    }
                  `}
                >
                  <Icon
                    size={18}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? 'text-[#0e2e50]/85'
                        : isCompleted
                          ? 'text-[#0e2e50]/50'
                          : 'text-muted-foreground/35'
                    }`}
                  />
                </div>
              </motion.button>

              {/* Connector Line */}
              {index < phases.length - 1 && (
                <div
                  className={`w-3 h-px transition-colors duration-200 ${
                    isCompleted || isActive
                      ? 'bg-[#0e2e50]/20'
                      : 'bg-muted-foreground/15'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Label */}
      {showLabel && (
        <motion.div
          key={currentPhaseId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-xs font-bold text-muted-foreground uppercase tracking-[0.15em]"
        >
          {phases.find((p) => p.id === currentPhaseId)?.label}
        </motion.div>
      )}
    </div>
  );
}
