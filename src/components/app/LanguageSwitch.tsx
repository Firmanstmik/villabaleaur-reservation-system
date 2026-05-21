import { Languages } from "lucide-react";
import { motion } from "framer-motion";

import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitchProps {
  isHome?: boolean;
  dark?: boolean;
  className?: string;
  compact?: boolean;
}

const languageOptions: Array<{ value: Language; label: string }> = [
  { value: "id", label: "ID" },
  { value: "en", label: "EN" },
];

export default function LanguageSwitch({ isHome = false, dark = false, className, compact = false }: LanguageSwitchProps) {
  const { language, setLanguage, translations } = useLanguage();
  const useDarkTheme = dark || isHome;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border p-1 shadow-[0_16px_34px_-24px_rgba(16,42,67,0.42)] backdrop-blur-xl",
        useDarkTheme ? "border-white/12 bg-white/10 text-white" : "border-[rgba(217,179,106,0.16)] bg-[rgba(248,247,244,0.9)] text-[#102A43]",
        compact ? "w-full justify-between rounded-[1.4rem] px-3 py-2" : "",
        className,
      )}
      aria-label={translations.app.nav.language}
    >
      <div className={cn("flex items-center gap-2 px-2", compact ? "text-sm" : "text-xs uppercase tracking-[0.24em]")}>
        <Languages size={compact ? 16 : 15} className={cn(useDarkTheme ? "text-[#E8C98B]" : "text-[#5FA9C6]")} />
        <span className={cn("font-semibold", compact ? "tracking-normal" : "")}>{translations.app.nav.language}</span>
      </div>

      <div
        className={cn(
          "relative inline-grid grid-cols-2 rounded-full p-1",
          useDarkTheme ? "bg-[rgba(255,255,255,0.08)]" : "bg-[rgba(16,42,67,0.05)]",
        )}
      >
        <motion.div
          className={cn(
            "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full shadow-[0_12px_24px_-18px_rgba(16,42,67,0.52)]",
            useDarkTheme ? "bg-[linear-gradient(135deg,rgba(232,201,139,0.98)_0%,rgba(217,179,106,0.95)_100%)]" : "bg-white",
          )}
          animate={{ x: language === "id" ? 0 : "100%" }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        />

        {languageOptions.map((option) => {
          const active = language === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setLanguage(option.value)}
              className={cn(
                "relative z-10 min-w-[52px] rounded-full px-3 py-2 text-xs font-semibold transition-colors duration-300",
                active ? "text-[#102A43]" : useDarkTheme ? "text-white/78 hover:text-white" : "text-[#6B7280] hover:text-[#102A43]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
