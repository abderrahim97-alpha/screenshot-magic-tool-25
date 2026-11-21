import * as React from "react";

import { cn } from "@/lib/utils";

/** Shared field look: 48px tall, 16px text (no iOS zoom), soft focus ring. */
export const fieldClass =
  "flex h-12 w-full rounded-2xl border border-input bg-white px-4 text-base text-foreground shadow-[0_1px_2px_rgb(13_27_62/0.04)] transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-primary/30 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          fieldClass,
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
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
