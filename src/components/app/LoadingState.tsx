import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export default function LoadingState({ label, className }: LoadingStateProps) {
  const { translations } = useLanguage();
  const resolvedLabel = label ?? translations.app.loadingFallback;

  return (
    <div className={cn("flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-[rgba(217,179,106,0.2)] bg-[rgba(248,247,244,0.74)] p-8 text-center", className)}>
      <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-[rgba(232,201,139,0.28)] border-t-[#1F4E68]" />
      <p className="text-sm text-[#6B7280]">{resolvedLabel}</p>
    </div>
  );
}
