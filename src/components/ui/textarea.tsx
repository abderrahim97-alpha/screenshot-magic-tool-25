import * as React from "react";

import { fieldClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(fieldClass, "h-auto min-h-[7.5rem] py-3 leading-relaxed", className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
