import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  accent?: string;
  trend?: {
    label: string;
    value?: string;
    tone?: "gold" | "blue" | "red" | "neutral";
  };
}

const trendToneStyles: Record<NonNullable<StatCardProps["trend"]>["tone"], string> = {
  gold: "bg-[rgba(246,231,193,0.82)] text-[#7A5D21] ring-1 ring-[rgba(217,179,106,0.22)]",
  blue: "bg-[rgba(169,215,232,0.2)] text-[#1F4E68] ring-1 ring-[rgba(95,169,198,0.18)]",
  red: "bg-[rgba(255,235,235,0.92)] text-[#B54747] ring-1 ring-[rgba(229,72,77,0.14)]",
  neutral: "bg-[rgba(239,233,223,0.9)] text-[#6B7280] ring-1 ring-[rgba(107,114,128,0.16)]",
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  accent = "bg-[rgba(232,201,139,0.28)] text-[#102A43]",
  trend,
}: StatCardProps) {
  return (
    <Card className="group overflow-hidden rounded-[2.1rem] border border-white/70 bg-[rgba(248,247,244,0.9)] shadow-[0_34px_88px_-56px_rgba(16,42,67,0.32)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_48px_110px_-60px_rgba(16,42,67,0.36)]">
      <CardContent className="relative p-7">
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,201,139,0.22),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(169,215,232,0.18),transparent_45%)]" />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-[1.4rem] shadow-[0_22px_50px_-36px_rgba(16,42,67,0.28)] ${accent}`}>
            <Icon size={22} />
          </div>
          {trend ? (
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                trendToneStyles[trend.tone ?? "neutral"]
              }`}
            >
              {trend.value ? <span className="font-bold">{trend.value}</span> : null}
              <span className="text-[10px] tracking-[0.18em]">{trend.label}</span>
            </span>
          ) : null}
        </div>

        <div className="relative mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#6B7280]">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[#102A43] md:text-4xl">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
