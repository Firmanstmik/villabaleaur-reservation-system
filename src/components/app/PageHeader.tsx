import type { ReactNode } from "react";

import ScrollReveal from "@/components/app/ScrollReveal";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({ eyebrow, title, description, action, className }: PageHeaderProps) {
  return (
    <ScrollReveal className={cn("mb-8 md:mb-10", className)}>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#5FA9C6]">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#102A43] md:text-5xl">{title}</h1>
          {description ? <p className="mt-4 text-sm leading-7 text-[#6B7280] md:text-base">{description}</p> : null}
        </div>
        {action ? <div className="flex shrink-0 flex-wrap gap-3">{action}</div> : null}
      </div>
    </ScrollReveal>
  );
}
