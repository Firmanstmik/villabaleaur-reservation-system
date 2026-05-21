import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { BookingStatus, VillaStatus } from "@/types/app";

interface StatusBadgeProps {
  status: BookingStatus | VillaStatus;
}

const colorMap: Record<string, string> = {
  tersedia: "bg-[rgba(169,215,232,0.2)] text-[#1F4E68] ring-1 ring-[rgba(95,169,198,0.18)]",
  maintenance: "bg-[rgba(232,201,139,0.22)] text-[#8B6A25] ring-1 ring-[rgba(217,179,106,0.2)]",
  nonaktif: "bg-[rgba(239,233,223,0.88)] text-[#6B7280] ring-1 ring-[rgba(107,114,128,0.15)]",
  menunggu: "bg-[rgba(246,231,193,0.7)] text-[#8B6A25] ring-1 ring-[rgba(217,179,106,0.22)]",
  disetujui: "bg-[rgba(169,215,232,0.2)] text-[#1F4E68] ring-1 ring-[rgba(95,169,198,0.18)]",
  ditolak: "bg-[rgba(255,235,235,0.9)] text-[#B54747] ring-1 ring-[rgba(229,72,77,0.14)]",
  selesai: "bg-[rgba(232,201,139,0.22)] text-[#7A5D21] ring-1 ring-[rgba(217,179,106,0.2)]",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { translations } = useLanguage();

  return (
    <span className={cn("inline-flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]", colorMap[status])}>
      {translations.app.status[status]}
    </span>
  );
}
