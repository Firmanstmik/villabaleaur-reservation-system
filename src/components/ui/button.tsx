import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#e8c98b_0%,#d9b36a_100%)] text-[#102A43] shadow-[0_16px_36px_-18px_rgba(217,179,106,0.9)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-22px_rgba(217,179,106,0.92)]",
        destructive: "bg-destructive text-destructive-foreground shadow-[0_12px_24px_-14px_rgba(239,68,68,0.5)] hover:-translate-y-0.5 hover:bg-destructive/90",
        outline:
          "border border-[rgba(95,169,198,0.22)] bg-[rgba(248,247,244,0.88)] text-[#1F4E68] shadow-[0_12px_28px_-22px_rgba(31,78,104,0.55)] hover:-translate-y-0.5 hover:border-[rgba(95,169,198,0.4)] hover:bg-[rgba(169,215,232,0.18)]",
        secondary:
          "bg-[linear-gradient(135deg,#a9d7e8_0%,#5fa9c6_100%)] text-white shadow-[0_16px_32px_-18px_rgba(31,78,104,0.7)] hover:-translate-y-0.5 hover:shadow-[0_20px_38px_-20px_rgba(31,78,104,0.82)]",
        ghost: "text-[#1F4E68] hover:bg-[rgba(169,215,232,0.16)] hover:text-[#102A43]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-8 text-sm",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
