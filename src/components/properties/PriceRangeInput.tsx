import { X } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SupportedCurrency } from '@/contexts/CurrencyContext';

interface PriceRangeInputProps {
  minPrice: string;
  maxPrice: string;
  onMinChange: (val: string) => void;
  onMaxChange: (val: string) => void;
  currency: SupportedCurrency;
  formatPrice: (eur: number, curr: SupportedCurrency, lang: string) => string;
}

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  IDR: 'Rp',
};

export function PriceRangeInput({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  currency,
  formatPrice,
}: PriceRangeInputProps) {
  const { exchangeRates } = useCurrency();
  const { language } = useLanguage();

  const currencySymbol = CURRENCY_SYMBOLS[currency] || '$';

  // Show EUR equivalent in hint text
  const showHint = (priceStr: string): string => {
    if (!priceStr || currency === 'EUR') return '';
    const n = parseFloat(priceStr);
    if (isNaN(n)) return '';
    const rate = exchangeRates[currency];
    if (!rate || rate === 0) return '';
    const eur = n / rate;
    return `≈ €${Math.round(eur).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}`;
  };

  return (
    <div className="flex gap-3">
      {/* Min Price */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
          {currencySymbol}
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={minPrice}
          onChange={(e) => onMinChange(e.target.value.replace(/[^0-9]/g, ''))}
          onBlur={(e) => {
            if (e.target.value) {
              const formatted = Number(e.target.value).toLocaleString();
              onMinChange(formatted);
            }
          }}
          className="w-full pl-7 pr-8 py-2.5 rounded-lg border border-border/60
                     bg-background text-sm focus:outline-none focus:border-ukon-red/60
                     transition-colors"
          placeholder="Min"
        />
        {minPrice && (
          <button
            onClick={() => onMinChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
        {minPrice && (
          <div className="mt-1 text-xs text-muted-foreground">{showHint(minPrice)}</div>
        )}
      </div>

      {/* Max Price */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
          {currencySymbol}
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={maxPrice}
          onChange={(e) => onMaxChange(e.target.value.replace(/[^0-9]/g, ''))}
          onBlur={(e) => {
            if (e.target.value) {
              const formatted = Number(e.target.value).toLocaleString();
              onMaxChange(formatted);
            }
          }}
          className="w-full pl-7 pr-8 py-2.5 rounded-lg border border-border/60
                     bg-background text-sm focus:outline-none focus:border-ukon-red/60
                     transition-colors"
          placeholder="Max"
        />
        {maxPrice && (
          <button
            onClick={() => onMaxChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        )}
        {maxPrice && (
          <div className="mt-1 text-xs text-muted-foreground">{showHint(maxPrice)}</div>
        )}
      </div>
    </div>
  );
}
