import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/** The louse drawn around (0, 0). Use inside an <svg>. */
function LouseGlyph() {
  return (
    <>
      <g className="louse-legs-left" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M-5-5-12-9l-3 3M-7 1l-9-1-3 4M-6 8l-7 5 1 4" />
      </g>
      <g className="louse-legs-right" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M5-5 12-9l3 3M7 1 16 0l3 4M6 8l7 5-1 4" />
      </g>
      <g className="louse-body">
        <ellipse cx="0" cy="5" rx="7" ry="11" fill="var(--color-destructive)" />
        <circle cx="0" cy="-8" r="6" fill="var(--color-destructive)" />
        <path
          d="M-4-11-7-16M4-11l3-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M-6 1h12M-7 6h14M-6 11h12"
          stroke="var(--color-destructive-foreground)"
          strokeWidth="1.5"
        />
        <circle cx="-2" cy="-9" r="1" fill="var(--color-destructive-foreground)" />
        <circle cx="2" cy="-9" r="1" fill="var(--color-destructive-foreground)" />
      </g>
    </>
  );
}

const STRAND_A = "M32 4C27 29 37 48 32 69S27 110 33 132s-4 44-1 64";
const STRAND_B = "M34 5C29 30 39 49 34 70s-5 41 1 62-4 43-1 62";

/**
 * Decorative louse that climbs a hair strand on the right edge while the page scrolls.
 * Mounted once from the root layout (see AGENTS.md). On phones it is smaller and sits in
 * the page gutter so it never covers text.
 */
export function ScrollingLouse() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const louseRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let frame = 0;
    let stopTimer = 0;
    const wrap = wrapRef.current;
    const louse = louseRef.current;
    if (!wrap || !louse) return;

    const update = () => {
      wrap.classList.add("is-crawling");
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => wrap.classList.remove("is-crawling"), 180);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const phase = (window.scrollY % 360) / 360;
        const climb = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
        louse.setAttribute("transform", `translate(32 ${20 + Math.round(climb * 150)})`);
      });
    };

    update();
    wrap.classList.remove("is-crawling");
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(stopTimer);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-[34%] -right-2.5 z-30 h-[120px] w-[38px] text-primary/80 motion-reduce:hidden sm:top-[27%] sm:right-0 sm:h-[200px] sm:w-16 sm:text-primary"
    >
      <svg viewBox="0 0 64 200" fill="none" className="h-full w-full">
        <g transform="translate(11 0)">
          <path d={STRAND_A} stroke="currentColor" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
          <path d={STRAND_B} stroke="currentColor" strokeOpacity=".2" strokeWidth="1" strokeLinecap="round" />
          <g ref={louseRef} transform="translate(32 20)">
            <LouseGlyph />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** Larger static illustration: the louse gently bobbing on its strand (hero, 404). */
export function LouseOnStrand({
  className,
  crawling = true,
}: {
  className?: string | undefined;
  crawling?: boolean;
}) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none text-primary", className)}>
      <svg viewBox="0 0 64 200" fill="none" className={cn("h-full w-full overflow-visible", crawling && "is-crawling")}>
        <g transform="translate(11 0)">
          <path d={STRAND_A} stroke="currentColor" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
          <path d={STRAND_B} stroke="currentColor" strokeOpacity=".2" strokeWidth="1" strokeLinecap="round" />
          <g transform="translate(32 60)">
            <g className="louse-bob">
              <LouseGlyph />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
