import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type RefObject,
} from "react";

import { cn } from "@/lib/utils";

/**
 * Marks an element with `data-shown` the first time it enters the viewport.
 * CSS (`[data-reveal]`, `[data-draw]` in styles.css) handles the actual animation,
 * so server-rendered markup stays visible when scripting or motion is disabled.
 */
export function useReveal<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "0px 0px -12% 0px", threshold = 0.12 } = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-shown", "");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold]);
}

type RevealProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string | undefined;
  delay?: number;
  variant?: "up" | "fade" | "scale";
  style?: CSSProperties;
  id?: string;
  /** Animate on page load with pure CSS (above-the-fold content, no wait for hydration). */
  load?: boolean;
};

export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  variant = "up",
  style,
  id,
  load = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(load ? { current: null } : ref);
  if (load) {
    return (
      <Tag
        id={id}
        className={cn(
          "animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-700 ease-out",
          className,
        )}
        style={{ ...style, animationDelay: `${delay}ms` }}
      >
        {children}
      </Tag>
    );
  }
  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={variant === "up" ? "" : variant}
      className={className}
      style={{ ...style, "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Returns true when the user asked the OS to reduce motion (client only). */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Number that counts up when scrolled into view. The final value is rendered on the
 * server, so the text is always correct even without JavaScript.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
  grouping = true,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  grouping?: boolean;
  className?: string | undefined;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) =>
    `${prefix}${n.toLocaleString("fr-FR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: grouping,
    })}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = format(value * eased);
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, prefix, suffix, duration, grouping]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(value)}
    </span>
  );
}
