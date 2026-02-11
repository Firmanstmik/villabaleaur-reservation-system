import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useLanguage, SupportedLanguage } from '@/contexts/LanguageContext';
import { useCurrency, SupportedCurrency } from '@/contexts/CurrencyContext';
import { cn } from '@/lib/utils';

export function LocaleDropdown() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, availableLanguages, t, isPending } = useLanguage();
  const { currency, setCurrency, availableCurrencies, isDetecting } = useCurrency();

  const isLoading = isPending || isDetecting;

  const languageLabels: Record<SupportedLanguage, string> = {
    en: 'English',
    id: 'Bahasa Indonesia',
    nl: 'Nederlands',
    es: 'Español',
  };

  const currencyLabels: Record<SupportedCurrency, string> = {
    USD: 'USD',
    EUR: 'EUR',
    IDR: 'IDR',
    GBP: 'GBP',
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    if (newLang !== language && !isLoading) {
      setLanguage(newLang);
    }
  };

  const handleCurrencyChange = (newCurrency: SupportedCurrency) => {
    if (newCurrency !== currency && !isLoading) {
      setCurrency(newCurrency);
    }
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            'relative p-2 rounded-lg transition-all duration-300',
            'hover:bg-muted/40 active:bg-muted/60',
            'text-foreground/60 hover:text-foreground',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
          disabled={isLoading}
          title="Language & Currency"
          type="button"
        >
          <Globe className="w-[1.2vw] h-[1.2vw] lg:w-5 lg:h-5" strokeWidth={1.5} />
          {isLoading && (
            <div className="absolute inset-0 rounded-lg bg-foreground/5 animate-pulse" />
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={12}
          className="z-50 p-0 rounded-xl border border-border/40 shadow-xl bg-background/95 backdrop-blur-md overflow-hidden will-change-auto"
          style={{ width: '280px', maxWidth: '90vw' }}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="px-0 py-3">
                  {/* Language Section */}
                  <div className="space-y-0.5 px-2">
                    <div className="px-2 py-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                        {t('common.language')}
                      </h3>
                    </div>
                    {availableLanguages.map((lang) => (
                      <motion.button
                        key={lang}
                        type="button"
                        onClick={() => handleLanguageChange(lang)}
                        disabled={isLoading}
                        whileHover={!isLoading ? { x: 2 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        className={cn(
                          'w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200',
                          'relative flex items-center justify-between',
                          'group',
                          language === lang
                            ? 'bg-primary/5'
                            : 'hover:bg-muted/30',
                          isLoading && 'cursor-not-allowed opacity-50'
                        )}
                      >
                        <span className={cn(
                          'transition-colors duration-200',
                          language === lang ? 'text-primary font-medium' : 'text-foreground/70 group-hover:text-foreground'
                        )}>
                          {languageLabels[lang]}
                        </span>
                        {language === lang && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border/20 my-2 mx-2" />

                  {/* Currency Section */}
                  <div className="space-y-0.5 px-2">
                    <div className="px-2 py-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                        {t('common.currency')}
                      </h3>
                    </div>
                    {availableCurrencies.map((curr) => (
                      <motion.button
                        key={curr}
                        type="button"
                        onClick={() => handleCurrencyChange(curr)}
                        disabled={isLoading}
                        whileHover={!isLoading ? { x: 2 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        className={cn(
                          'w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200',
                          'relative flex items-center justify-between',
                          'group',
                          currency === curr
                            ? 'bg-primary/5'
                            : 'hover:bg-muted/30',
                          isLoading && 'cursor-not-allowed opacity-50'
                        )}
                      >
                        <span className={cn(
                          'transition-colors duration-200',
                          currency === curr ? 'text-primary font-medium' : 'text-foreground/70 group-hover:text-foreground'
                        )}>
                          {currencyLabels[curr]}
                        </span>
                        {currency === curr && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check className="w-4 h-4 text-primary" strokeWidth={2.5} />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
