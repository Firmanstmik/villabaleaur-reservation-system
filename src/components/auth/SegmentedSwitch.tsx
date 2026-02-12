import React from 'react';
import { motion } from 'framer-motion';

export interface SegmentedSwitchOption {
  value: string;
  label: string;
}

interface SegmentedSwitchProps {
  options: SegmentedSwitchOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * Apple-inspired segmented control component
 * Premium design with smooth sliding indicator
 */
export const SegmentedSwitch = React.memo(
  ({ options, value, onChange, className = '' }: SegmentedSwitchProps) => {
    const activeIndex = options.findIndex((opt) => opt.value === value);

    return (
      <div
        className={`relative inline-flex p-1 bg-secondary/40 rounded-xl backdrop-blur-sm ${className}`}
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        }}
        role="tablist"
      >
        {/* Animated sliding indicator */}
        <motion.div
          layout
          layoutId="segmented-indicator"
          className="absolute h-[calc(100%-8px)] bg-white rounded-lg"
          style={{
            top: '4px',
            width: `calc(50% - 8px)`,
            left: activeIndex === 0 ? '4px' : 'calc(50% + 4px)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 30,
            mass: 0.8,
          }}
        />

        {/* Option buttons */}
        {options.map((option, index) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            role="tab"
            aria-selected={value === option.value}
            className={`relative z-10 flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 ${
              value === option.value
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    );
  }
);

SegmentedSwitch.displayName = 'SegmentedSwitch';
