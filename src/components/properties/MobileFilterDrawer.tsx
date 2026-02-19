import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PriceRangeInput } from './PriceRangeInput';
import type { FilterState } from '@/types/filters';
import type { UseFiltersReturn } from '@/hooks/useFilters';
import {
  PROPERTY_TYPES,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  LIFESTYLE_TAGS,
} from '@/types/filters';
import { cn } from '@/lib/utils';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilter: UseFiltersReturn['setFilter'];
  resetFilters: () => void;
  resultCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilter,
  resetFilters,
  resultCount,
}: MobileFilterDrawerProps) {
  const { t } = useLanguage();
  const { currency, formatPrice } = useCurrency();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer-panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[90vh] bg-background rounded-t-3xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 flex-shrink-0">
              <h2 className="text-lg font-semibold text-foreground">
                {t('filters.refine') || 'Filters'}
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close filters"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
              {/* Location Search */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
                  {t('filters.location')}
                </label>
                <div
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors',
                    filters.location
                      ? 'border-ukon-red/60 bg-ukon-red/5'
                      : 'border-border/40'
                  )}
                >
                  <Search size={16} className="text-muted-foreground flex-shrink-0" />
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilter('location', e.target.value)}
                    placeholder={t('filters.locationPlaceholder') || 'City, district, address...'}
                    className="flex-1 bg-transparent text-sm focus:outline-none placeholder-muted-foreground"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
                  {currency} {t('filters.priceRange')}
                </label>
                <PriceRangeInput
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onMinChange={(v) => setFilter('minPrice', v)}
                  onMaxChange={(v) => setFilter('maxPrice', v)}
                  currency={currency}
                  formatPrice={formatPrice}
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
                  {t('filters.propertyType')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter('propertyType', type as FilterState['propertyType'])}
                      className={cn(
                        'px-3.5 py-2 rounded-full text-sm transition-colors border',
                        filters.propertyType === type
                          ? 'bg-ukon-red/8 text-ukon-red font-medium border-ukon-red/30'
                          : 'border-border/40 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {type === 'all'
                        ? t('filters.allTypes')
                        : t(`filters.propertyTypes.${type.toLowerCase()}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
                  {t('filters.bedrooms')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFilter('bedrooms', opt as FilterState['bedrooms'])}
                      className={cn(
                        'px-3.5 py-2 rounded-full text-sm transition-colors border',
                        filters.bedrooms === opt
                          ? 'bg-ukon-red/8 text-ukon-red font-medium border-ukon-red/30'
                          : 'border-border/40 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {opt === 'any' ? t('filters.any') : `${opt}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
                  {t('filters.bathrooms')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {BATHROOM_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFilter('bathrooms', opt as FilterState['bathrooms'])}
                      className={cn(
                        'px-3.5 py-2 rounded-full text-sm transition-colors border',
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

              {/* Interior Size */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
                  {t('filters.interiorSize')}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={filters.minSize}
                    onChange={(e) => setFilter('minSize', e.target.value.replace(/[^0-9]/g, ''))}
                    className="flex-1 px-3 py-3 rounded-xl border border-border/60
                               bg-background text-sm focus:outline-none focus:border-ukon-red/60
                               transition-colors"
                    placeholder={t('filters.minSize')}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={filters.maxSize}
                    onChange={(e) => setFilter('maxSize', e.target.value.replace(/[^0-9]/g, ''))}
                    className="flex-1 px-3 py-3 rounded-xl border border-border/60
                               bg-background text-sm focus:outline-none focus:border-ukon-red/60
                               transition-colors"
                    placeholder={t('filters.maxSize')}
                  />
                </div>
              </div>

              {/* Lifestyle Tags */}
              <div>
                <label className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-3">
                  Lifestyle
                </label>
                <div className="flex flex-wrap gap-2">
                  {LIFESTYLE_TAGS.map((tag) => {
                    const active = filters.lifestyle.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          const next = active
                            ? filters.lifestyle.filter((t) => t !== tag)
                            : [...filters.lifestyle, tag];
                          setFilter('lifestyle', next);
                        }}
                        className={cn(
                          'px-3.5 py-2 rounded-full text-xs font-medium uppercase tracking-wide',
                          'transition-all duration-150 border',
                          active
                            ? 'bg-ukon-red/8 border-ukon-red/40 text-ukon-red'
                            : 'border-border/30 text-muted-foreground'
                        )}
                      >
                        {t(`filters.lifestyle.${tag.toLowerCase().replace(/\s+/g, '_')}`)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-border/20 bg-background flex items-center gap-3">
              <button
                onClick={() => {
                  resetFilters();
                }}
                className="px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('filters.clearAll')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-[#0e2e50] text-white text-sm font-medium
                           hover:bg-[#0e2e50]/90 transition-colors"
              >
                {resultCount} {t('filters.propertiesFound')}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
