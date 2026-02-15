import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PriceRangeInput } from './PriceRangeInput';
import type { FilterState } from '@/types/filters';
import type { UseFiltersReturn } from '@/hooks/useFilters';
import { BATHROOM_OPTIONS, LIFESTYLE_TAGS } from '@/types/filters';
import { cn } from '@/lib/utils';

interface RefinePanelProps {
  isOpen: boolean;
  filters: FilterState;
  setFilter: UseFiltersReturn['setFilter'];
  resetFilters: () => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

export function RefinePanel({
  isOpen,
  filters,
  setFilter,
  resetFilters,
  onClose,
  anchorRef,
}: RefinePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { formatPrice, currency } = useCurrency();

  // Click-outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose, anchorRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-96
                     bg-background/96 backdrop-blur-md rounded-xl shadow-xl
                     border border-border/25 p-5"
        >
          {/* Bathrooms Section */}
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
              {t('filters.bathrooms')}
            </label>
            <div className="flex flex-wrap gap-2">
              {BATHROOM_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilter('bathrooms', opt as FilterState['bathrooms'])}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm transition-colors border',
                    filters.bathrooms === opt
                      ? 'bg-ukon-red/8 text-ukon-red font-medium border-ukon-red/30'
                      : 'border-border/40 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {opt === 'any' ? t('filters.any') : `${opt}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Interior Size Section */}
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
              {t('filters.interiorSize')}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                inputMode="numeric"
                value={filters.minSize}
                onChange={(e) => setFilter('minSize', e.target.value.replace(/[^0-9]/g, ''))}
                className="flex-1 px-3 py-2.5 rounded-lg border border-border/60
                           bg-background text-sm focus:outline-none focus:border-ukon-red/60
                           transition-colors"
                placeholder={t('filters.minSize')}
              />
              <input
                type="text"
                inputMode="numeric"
                value={filters.maxSize}
                onChange={(e) => setFilter('maxSize', e.target.value.replace(/[^0-9]/g, ''))}
                className="flex-1 px-3 py-2.5 rounded-lg border border-border/60
                           bg-background text-sm focus:outline-none focus:border-ukon-red/60
                           transition-colors"
                placeholder={t('filters.maxSize')}
              />
            </div>
          </div>

          {/* Lifestyle Tags Section */}
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
              {t('filters.lifestyle')}
            </label>
            <div className="flex flex-wrap gap-2">
              {LIFESTYLE_TAGS.map((tag) => {
                const active = filters.lifestyle.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const next = active
                        ? filters.lifestyle.filter((t) => t !== tag)
                        : [...filters.lifestyle, tag];
                      setFilter('lifestyle', next);
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide',
                      'transition-all duration-150 border',
                      active
                        ? 'bg-ukon-red/8 border-ukon-red/40 text-ukon-red'
                        : 'border-border/30 text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                    )}
                  >
                    {t(`filters.lifestyle.${tag.toLowerCase().replace(/\s+/g, '_')}`)}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer: Clear All + Done */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/20">
            <button
              onClick={() => {
                resetFilters();
                onClose();
              }}
              className="text-sm text-muted-foreground hover:text-ukon-red transition-colors"
            >
              {t('filters.clearAll')}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-ukon-red/8 text-ukon-red text-sm font-medium
                         hover:bg-ukon-red/12 transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
