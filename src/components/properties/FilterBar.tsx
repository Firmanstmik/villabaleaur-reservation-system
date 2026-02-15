import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { RefinePanel } from './RefinePanel';
import { PriceRangeInput } from './PriceRangeInput';
import type { FilterState } from '@/types/filters';
import type { UseFiltersReturn } from '@/hooks/useFilters';
import { PROPERTY_TYPES, BEDROOM_OPTIONS } from '@/types/filters';
import { cn } from '@/lib/utils';

type OpenPanel = 'location' | 'price' | 'bedrooms' | 'propertyType' | 'refine' | null;

interface FilterBarProps {
  filters: FilterState;
  setFilter: UseFiltersReturn['setFilter'];
  resetFilters: () => void;
  activeFilterCount: number;
  resultCount: number;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  IDR: 'Rp',
};

function formatShort(numStr: string, currency: string): string {
  const n = parseFloat(numStr.replace(/[^0-9]/g, ''));
  if (isNaN(n)) return '';
  const sym = CURRENCY_SYMBOLS[currency] || '$';
  if (n >= 1_000_000) {
    const val = (n / 1_000_000).toFixed(1).replace('.0', '');
    return `${sym}${val}M`;
  }
  if (n >= 1_000) {
    const val = Math.round(n / 1_000);
    return `${sym}${val}K`;
  }
  return `${sym}${n}`;
}

export function FilterBar({
  filters,
  setFilter,
  resetFilters,
  activeFilterCount,
  resultCount,
}: FilterBarProps) {
  const { t } = useLanguage();
  const { currency, formatPrice, isLoading: currencyLoading } = useCurrency();
  const barRef = useRef<HTMLDivElement>(null);
  const refineButtonRef = useRef<HTMLButtonElement>(null);
  const locationAnchorRef = useRef<HTMLDivElement>(null);

  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);

  const toggle = (panel: OpenPanel) => {
    setOpenPanel((prev) => (prev === panel ? null : panel));
  };

  // Count refine panel active filters
  const refineCount = (() => {
    let count = 0;
    if (filters.bathrooms !== 'any') count++;
    if (filters.minSize || filters.maxSize) count++;
    count += filters.lifestyle.length;
    return count;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      ref={barRef}
      className="relative"
    >
      {/* Main Filter Bar */}
      <div
        className="h-14 bg-background/95 backdrop-blur-sm rounded-2xl shadow-lg
                   border border-border/30 relative px-6 overflow-visible"
      >
        {/* Inner scrollable flex container - no overflow, dropdowns escape freely */}
        <div className="h-full flex items-stretch gap-4 overflow-x-auto overflow-y-visible no-scrollbar">
          {/* Section 1: Transaction Type (inline pills) */}
          <div className="flex items-center gap-1 px-3 flex-shrink-0 relative">
          {(['all', 'sale', 'rent'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter('transactionType', type)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap',
                filters.transactionType === type
                  ? 'bg-ukon-red/8 text-ukon-red font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {type === 'all'
                ? t('filters.transactionType.all')
                : type === 'sale'
                  ? t('filters.transactionType.sale')
                  : t('filters.transactionType.rent')}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border/25 self-center flex-shrink-0" />

        {/* Section 2: Location (most prominent) */}
        <div className="relative flex-shrink-0 min-w-[140px]" ref={locationAnchorRef}>
          <button
            onClick={() => toggle('location')}
            className={cn(
              'h-full flex items-center gap-2 px-6 text-sm transition-colors whitespace-nowrap',
              openPanel === 'location' || filters.location
                ? 'bg-ukon-red/8 text-ukon-red font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Search size={15} />
            {filters.location
              ? filters.location.length > 14
                ? filters.location.slice(0, 14) + '…'
                : filters.location
              : t('filters.location')}
            <ChevronDown
              size={14}
              className={cn(
                'transition-transform duration-200',
                openPanel === 'location' ? 'rotate-180' : ''
              )}
            />
          </button>

          <AnimatePresence>
            {openPanel === 'location' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 top-[calc(100%+8px)] z-50 w-64
                           bg-background/96 backdrop-blur-md rounded-xl shadow-xl
                           border border-border/25 p-4"
              >
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    autoFocus
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilter('location', e.target.value)}
                    placeholder={t('filters.locationPlaceholder')}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border/60
                               bg-background text-sm focus:outline-none focus:border-ukon-red/60
                               transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border/25 self-center flex-shrink-0" />

        {/* Section 3: Price Range */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => toggle('price')}
            className={cn(
              'h-full flex items-center gap-2 px-4 text-sm transition-colors whitespace-nowrap',
              openPanel === 'price' || filters.minPrice || filters.maxPrice
                ? 'bg-ukon-red/8 text-ukon-red font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {filters.minPrice || filters.maxPrice
              ? `${formatShort(filters.minPrice, currency)}${filters.maxPrice ? ' – ' + formatShort(filters.maxPrice, currency) : '+'}`
              : t('filters.priceRange')}
            <ChevronDown
              size={14}
              className={cn(
                'transition-transform duration-200',
                openPanel === 'price' ? 'rotate-180' : ''
              )}
            />
          </button>

          <AnimatePresence>
            {openPanel === 'price' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 top-[calc(100%+8px)] z-50 w-80
                           bg-background/96 backdrop-blur-md rounded-xl shadow-xl
                           border border-border/25 p-5"
              >
                <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-4">
                  {currency} {t('filters.priceRange')}
                </div>
                <PriceRangeInput
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  onMinChange={(v) => setFilter('minPrice', v)}
                  onMaxChange={(v) => setFilter('maxPrice', v)}
                  currency={currency}
                  formatPrice={formatPrice}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border/25 self-center flex-shrink-0" />

        {/* Section 4: Bedrooms */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => toggle('bedrooms')}
            className={cn(
              'h-full flex items-center gap-2 px-4 text-sm transition-colors whitespace-nowrap',
              openPanel === 'bedrooms' || filters.bedrooms !== 'any'
                ? 'bg-ukon-red/8 text-ukon-red font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {filters.bedrooms === 'any'
              ? t('filters.bedrooms')
              : `${filters.bedrooms}+ ${t('filters.beds')}`}
            <ChevronDown
              size={14}
              className={cn(
                'transition-transform duration-200',
                openPanel === 'bedrooms' ? 'rotate-180' : ''
              )}
            />
          </button>

          <AnimatePresence>
            {openPanel === 'bedrooms' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 top-[calc(100%+8px)] z-50 w-56
                           bg-background/96 backdrop-blur-md rounded-xl shadow-xl
                           border border-border/25 p-4"
              >
                <div className="flex flex-wrap gap-2">
                  {BEDROOM_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFilter('bedrooms', opt as FilterState['bedrooms']);
                        setOpenPanel(null);
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm transition-colors border',
                        filters.bedrooms === opt
                          ? 'bg-ukon-red/8 text-ukon-red font-medium border-ukon-red/30'
                          : 'border-border/40 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {opt === 'any' ? t('filters.any') : `${opt}+`}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border/25 self-center flex-shrink-0" />

        {/* Section 5: Property Type */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => toggle('propertyType')}
            className={cn(
              'h-full flex items-center gap-2 px-4 text-sm transition-colors whitespace-nowrap',
              openPanel === 'propertyType' || filters.propertyType !== 'all'
                ? 'bg-ukon-red/8 text-ukon-red font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {filters.propertyType === 'all'
              ? t('filters.propertyType')
              : filters.propertyType}
            <ChevronDown
              size={14}
              className={cn(
                'transition-transform duration-200',
                openPanel === 'propertyType' ? 'rotate-180' : ''
              )}
            />
          </button>

          <AnimatePresence>
            {openPanel === 'propertyType' && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 top-[calc(100%+8px)] z-50 w-56
                           bg-background/96 backdrop-blur-md rounded-xl shadow-xl
                           border border-border/25 py-2"
              >
                <div className="flex flex-col">
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFilter('propertyType', type as FilterState['propertyType']);
                        setOpenPanel(null);
                      }}
                      className={cn(
                        'px-4 py-2.5 text-sm text-left transition-colors',
                        filters.propertyType === type
                          ? 'bg-ukon-red/8 text-ukon-red font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      )}
                    >
                      {type === 'all'
                        ? t('filters.allTypes')
                        : t(`filters.propertyTypes.${type.toLowerCase()}`)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-border/25 self-center flex-shrink-0" />

        {/* Section 6: Refine */}
        <div className="relative flex-shrink-0">
          <button
            ref={refineButtonRef}
            onClick={() => toggle('refine')}
            className={cn(
              'h-full flex items-center gap-2 px-4 text-sm transition-colors whitespace-nowrap',
              openPanel === 'refine' || refineCount > 0
                ? 'bg-ukon-red/8 text-ukon-red font-medium'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <SlidersHorizontal size={15} />
            {t('filters.refine')}
            {refineCount > 0 && (
              <span
                className="w-5 h-5 rounded-full bg-ukon-red/8 text-ukon-red text-xs
                           flex items-center justify-center font-medium"
              >
                {refineCount}
              </span>
            )}
          </button>

          <RefinePanel
            isOpen={openPanel === 'refine'}
            filters={filters}
            setFilter={setFilter}
            resetFilters={resetFilters}
            onClose={() => setOpenPanel(null)}
            anchorRef={refineButtonRef}
          />
        </div>
        </div>
      </div>

      {/* Results Counter (shows only when filtered) */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex items-center justify-between px-[2vw] py-3 text-sm text-muted-foreground"
        >
          <span>
            <span className="text-foreground font-medium">{resultCount}</span>
            {' '}
            {t('filters.propertiesFound')}
          </span>
          <button
            onClick={resetFilters}
            className="text-ukon-red text-xs hover:text-ukon-red/80 transition-colors"
          >
            {t('filters.clearAll')}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
