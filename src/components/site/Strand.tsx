import { useRef, type CSSProperties, type ReactNode } from "react";

import { useReveal } from "@/components/site/Reveal";
import { cn } from "@/lib/utils";

/** Builds a smooth wavy path along one axis (the "hair strand" motif). */
function wavePath(length: number, amplitude: number, waves: number, vertical = false) {
  const step = length / (waves * 2);
  const mid = amplitude + 1;
  let d = vertical ? `M${mid} 0` : `M0 ${mid}`;
  for (let i = 0; i < waves * 2; i++) {
    const dir = i % 2 === 0 ? -1 : 1;
    const c = (i + 0.5) * step;
    const e = (i + 1) * step;
    d += vertical
      ? ` Q${mid + dir * amplitude} ${c} ${mid} ${e}`
      : ` Q${c} ${mid + dir * amplitude} ${e} ${mid}`;
  }
  return d;
}

/**
 * Thin wavy line used as divider / timeline connector. Draws itself on scroll.
 */
export function HairStrand({
  className,
  vertical = false,
  waves = 6,
  amplitude = 5,
  strokeWidth = 2,
  draw = true,
  delay = 150,
}: {
  className?: string | undefined;
  vertical?: boolean;
  waves?: number;
  amplitude?: number;
  strokeWidth?: number;
  draw?: boolean;
  delay?: number;
}) {
  // Observe an unclipped wrapper: IntersectionObserver honours the target's own clip-path.
  const ref = useRef<HTMLSpanElement>(null);
  useReveal(ref, { threshold: 0.2 });
  const length = 600;
  const box = amplitude * 2 + 2;
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-draw={draw ? "" : undefined}
      className={cn("block", className)}
      style={{ "--draw-delay": `${delay}ms` } as CSSProperties}
    >
      <svg
        viewBox={vertical ? `0 0 ${box} ${length}` : `0 0 ${length} ${box}`}
        preserveAspectRatio="none"
        fill="none"
        className={cn("block h-full w-full overflow-visible", vertical ? "draw-y" : "draw-x")}
      >
        <path
          d={wavePath(length, amplitude, waves, vertical)}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/** Highlighted word in a headline, underlined by a hand-drawn strand. */
export function Highlight({
  children,
  className,
  tone = "mint",
}: {
  children: ReactNode;
  className?: string | undefined;
  tone?: "mint" | "red" | "white";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useReveal(ref, { threshold: 0.4 });
  const color =
    tone === "red" ? "text-destructive" : tone === "white" ? "text-mint" : "text-mint";
  return (
    <span
      ref={ref}
      data-draw=""
      className={cn("relative inline-block whitespace-nowrap", className)}
    >
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        fill="none"
        className={cn("draw-x absolute -bottom-[0.16em] left-0 h-[0.3em] w-full", color)}
        style={{ "--draw-delay": "350ms" } as CSSProperties}
      >
        <path
          d="M3 9 C 28 2, 46 13, 72 7 S 118 2, 142 8 S 182 12, 197 5"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

/** Wraps the first occurrence of `word` inside `text` with <Highlight>. */
export function withHighlight(text: string, word?: string, tone?: "mint" | "red" | "white") {
  if (!word) return text;
  const i = text.indexOf(word);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <Highlight {...(tone ? { tone } : {})}>{word}</Highlight>
      {text.slice(i + word.length)}
    </>
  );
}
