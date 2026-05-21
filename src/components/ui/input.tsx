import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[1.35rem] border border-[rgba(217,179,106,0.2)] bg-[rgba(248,247,244,0.94)] px-4 py-3 text-sm text-[#102A43] shadow-[0_18px_34px_-26px_rgba(16,42,67,0.38)] ring-offset-background transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#6B7280] focus-visible:border-[rgba(95,169,198,0.48)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(95,169,198,0.16)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
