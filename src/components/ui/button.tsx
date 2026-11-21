import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Add `<ArrowRight data-arrow />` inside a button to get the sliding-arrow hover effect.
 */
const buttonVariants = cva(
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold cursor-pointer select-none transition-[transform,background-color,box-shadow,border-color,color] duration-300 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_[data-arrow]]:transition-transform [&_[data-arrow]]:duration-300 hover:[&_[data-arrow]]:translate-x-1",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary/90",
        cta: "bg-destructive text-destructive-foreground shadow-glow hover:-translate-y-0.5 hover:bg-[#c81f23]",
        mint: "bg-mint text-mint-foreground shadow-soft hover:bg-mint/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-navy/15 bg-white text-navy shadow-soft hover:border-primary/40 hover:text-primary",
        glass:
          "border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-4 text-sm",
        lg: "h-14 px-7 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
