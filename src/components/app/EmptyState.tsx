import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex min-h-[240px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[rgba(217,179,106,0.2)] bg-[rgba(248,247,244,0.78)] px-6 py-10 text-center shadow-[0_24px_60px_-45px_rgba(16,42,67,0.22)]", className)}>
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(232,201,139,0.22)] text-[#102A43]">
        <Inbox size={24} />
      </div>
      <h3 className="text-xl font-semibold text-[#102A43]">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-[#6B7280]">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
