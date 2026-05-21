import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-[1.35rem] border border-[rgba(217,179,106,0.2)] bg-[rgba(248,247,244,0.94)] px-4 py-3 text-sm text-[#102A43] shadow-[0_18px_34px_-26px_rgba(16,42,67,0.38)] ring-offset-background transition-all duration-300 placeholder:text-[#6B7280] focus-visible:border-[rgba(95,169,198,0.48)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(95,169,198,0.16)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
