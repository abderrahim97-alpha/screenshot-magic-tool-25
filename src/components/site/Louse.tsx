import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/* ======================================================================
 * Realistic louse, drawn facing UP around (0, 0). ~44 units long.
 * Legs move in a tripod gait (gait-a / gait-b) when the parent has
 * `.louse-crawl`. Antennae twitch on their own. See CSS in styles.css.
 * ==================================================================== */

const INK = "#5E4330";
const SHELL = "#A9845F";
const SHELL_LIGHT = "#C7A27C";

type Leg = { d: string; claw: string; origin: string; gait: "gait-a" | "gait-b" };

const legs: Leg[] = [
  // left side (origin = inner end of the leg)
  { d: "M-5 -10 L-10.5 -14.5 L-14.5 -12", claw: "M-14.5 -12 q-2.2 .6 -1.6 2.8", origin: "100% 100%", gait: "gait-a" },
  { d: "M-5.8 -7 L-12.5 -6.5 L-16 -2.5", claw: "M-16 -2.5 q-2.2 .4 -1.8 2.6", origin: "100% 20%", gait: "gait-b" },
  { d: "M-5.2 -4 L-11 1.5 L-12.5 7", claw: "M-12.5 7 q-2 .9 -1 3", origin: "100% 0%", gait: "gait-a" },
  // right side
  { d: "M5 -10 L10.5 -14.5 L14.5 -12", claw: "M14.5 -12 q2.2 .6 1.6 2.8", origin: "0% 100%", gait: "gait-b" },
  { d: "M5.8 -7 L12.5 -6.5 L16 -2.5", claw: "M16 -2.5 q2.2 .4 1.8 2.6", origin: "0% 20%", gait: "gait-a" },
  { d: "M5.2 -4 L11 1.5 L12.5 7", claw: "M12.5 7 q2 .9 1 3", origin: "0% 0%", gait: "gait-b" },
];

function LouseGlyph() {
  return (
    <g className="louse-shake">
      {/* soft contact shadow */}
      <ellipse cx="1.5" cy="4" rx="11" ry="17" fill="#17203A" opacity=".10" />

      {/* legs */}
      {legs.map((l) => (
        <g
          key={l.d}
          className={cn("louse-leg", l.gait)}
          style={{ transformOrigin: l.origin }}
          stroke={INK}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d={l.d} strokeWidth="1.9" />
          <path d={l.claw} strokeWidth="1.3" />
        </g>
      ))}

      {/* antennae (5 segments) */}
      {[-1, 1].map((s) => (
        <g key={s} className="louse-antenna" style={{ animationDelay: s < 0 ? "0s" : "-1.7s" }}>
          <path
            d={`M${s * 2.6} -19 L${s * 4.4} -21.6 L${s * 4.9} -24.4 L${s * 6.4} -26.6 L${s * 6.9} -29`}
            stroke={INK}
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {(
            [
              [4.4, -21.6],
              [4.9, -24.4],
              [6.4, -26.6],
            ] as const
          ).map(([x, y]) => (
            <circle key={`${x}${y}`} cx={s * x} cy={y} r=".7" fill={INK} />
          ))}
        </g>
      ))}

      {/* abdomen */}
      <ellipse cx="0" cy="8" rx="9.2" ry="13.5" fill={SHELL} fillOpacity=".95" stroke={INK} strokeWidth="1.1" />
      {/* translucent edge highlight */}
      <ellipse cx="-2.6" cy="5" rx="3.2" ry="8" fill={SHELL_LIGHT} opacity=".55" />
      {/* gut (blood meal) */}
      <ellipse cx=".4" cy="7.5" rx="3.3" ry="7.6" fill="#8C2E22" opacity=".6" />
      {/* segment lines */}
      {[0, 4, 8, 12, 16].map((y, i) => {
        const w = [8.6, 9.1, 9, 8.2, 6.6][i] ?? 8;
        return (
          <path
            key={y}
            d={`M${-w} ${y} Q0 ${y + 2.2} ${w} ${y}`}
            stroke={INK}
            strokeOpacity=".55"
            strokeWidth=".8"
            fill="none"
          />
        );
      })}
      {/* spiracles + bristles */}
      {[1.5, 5.5, 9.5, 13.5].map((y) => (
        <g key={y}>
          <circle cx="-7.9" cy={y} r=".75" fill={INK} />
          <circle cx="7.9" cy={y} r=".75" fill={INK} />
          <path d={`M-9 ${y + 1.2} l-1.8 .8M9 ${y + 1.2} l1.8 .8`} stroke={INK} strokeWidth=".6" strokeLinecap="round" />
        </g>
      ))}
      {/* tail notch */}
      <path d="M-2.2 20.6 Q0 23 2.2 20.6" stroke={INK} strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* thorax */}
      <ellipse cx="0" cy="-7" rx="6.4" ry="4.8" fill={SHELL} stroke={INK} strokeWidth="1.1" />
      <path d="M-4 -7.5h8" stroke={INK} strokeOpacity=".4" strokeWidth=".7" />

      {/* head */}
      <ellipse cx="0" cy="-15" rx="4.6" ry="5.3" fill={SHELL} stroke={INK} strokeWidth="1.1" />
      <ellipse cx="-1.2" cy="-16.4" rx="1.3" ry="2" fill={SHELL_LIGHT} opacity=".6" />
      {/* eyes */}
      <circle cx="-3.9" cy="-15.2" r="1.15" fill="#22150C" />
      <circle cx="3.9" cy="-15.2" r="1.15" fill="#22150C" />
      <circle cx="-4.2" cy="-15.6" r=".35" fill="#fff" opacity=".8" />
      <circle cx="3.6" cy="-15.6" r=".35" fill="#fff" opacity=".8" />
    </g>
  );
}

/* ======================================================================
 * Strand helpers — a gentle sine "hair" drawn in real pixels (no distortion)
 * ==================================================================== */

const WAVELENGTH = 150;

type Box = { w: number; h: number; cx: number; amp: number; top: number; bottom: number; scale: number };

const waveX = (b: Box, y: number, phase = 0) => b.cx + b.amp * Math.sin((y / WAVELENGTH) * Math.PI * 2 + phase);
const waveSlope = (b: Box, y: number) => b.amp * ((Math.PI * 2) / WAVELENGTH) * Math.cos((y / WAVELENGTH) * Math.PI * 2);

function strandPath(b: Box, phase = 0, dx = 0) {
  let d = "";
  for (let y = 0; y <= b.h; y += 6) {
    d += `${y === 0 ? "M" : "L"}${(waveX(b, y, phase) + dx).toFixed(2)} ${y}`;
  }
  return d;
}

/* ======================================================================
 * ScrollingLouse — crawls along a full-height hair strand on the right edge.
 * Its position follows the WHOLE page scroll progress (0% top → 100% bottom).
 * Hover / tap it and it panics, runs off, then walks back.
 * Mounted once from the root layout (AGENTS.md).
 * ==================================================================== */

export function ScrollingLouse() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const louseRef = useRef<SVGGElement>(null);
  const boxRef = useRef<Box>({ w: 64, h: 800, cx: 32, amp: 5, top: 120, bottom: 60, scale: 1.1 });
  const [box, setBox] = useState<Box>(boxRef.current);
  const panicRef = useRef<() => void>(() => {});

  // Measure the strand area (responsive).
  useEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const mobile = window.innerWidth < 640;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      const next: Box = {
        w,
        h,
        cx: mobile ? w - 13 : w / 2,
        amp: mobile ? 3 : 5,
        top: mobile ? 96 : 120, // below the header
        bottom: mobile ? 120 : 112, // above the mobile dock / desktop contact bubble
        scale: mobile ? 0.72 : 1.1,
      };
      boxRef.current = next;
      setBox(next);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Animation loop: smooth follow of the page progress.
  useEffect(() => {
    const wrap = wrapRef.current;
    const louse = louseRef.current;
    if (!wrap || !louse) return;

    const st = { y: 0, target: 0, offset: 0, dir: 1, raf: 0, running: false, stopTimer: 0 };

    const range = () => {
      const b = boxRef.current;
      return { min: b.top, max: Math.max(b.top, b.h - b.bottom) };
    };
    const scrollTarget = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const r = range();
      return r.min + p * (r.max - r.min);
    };

    const render = () => {
      const b = boxRef.current;
      const x = waveX(b, st.y);
      const slope = waveSlope(b, st.y);
      const deg = (st.dir > 0 ? Math.atan2(slope, -1) : Math.atan2(-slope, 1)) * (180 / Math.PI);
      louse.setAttribute("transform", `translate(${x.toFixed(2)} ${st.y.toFixed(2)}) rotate(${deg.toFixed(1)}) scale(${b.scale})`);
    };

    const tick = () => {
      const r = range();
      const goal = Math.min(r.max, Math.max(r.min, st.target + st.offset));
      st.offset *= 0.94;
      const d = goal - st.y;
      st.y += d * 0.12;
      const moving = Math.abs(d) > 0.35;
      if (moving) {
        st.dir = d > 0 ? 1 : -1;
        wrap.classList.add("louse-crawl");
        window.clearTimeout(st.stopTimer);
      }
      render();
      if (moving || Math.abs(st.offset) > 0.5) {
        st.raf = requestAnimationFrame(tick);
      } else {
        st.running = false;
        st.stopTimer = window.setTimeout(() => wrap.classList.remove("louse-crawl"), 120);
      }
    };

    const start = () => {
      if (st.running) return;
      st.running = true;
      st.raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      st.target = scrollTarget();
      start();
    };

    panicRef.current = () => {
      const r = range();
      let jump = st.dir * 110;
      if (st.y + jump > r.max || st.y + jump < r.min) jump = -jump;
      st.offset += jump;
      wrap.classList.add("louse-panic");
      window.setTimeout(() => wrap.classList.remove("louse-panic"), 650);
      start();
    };

    // Initial placement (no animation).
    st.target = scrollTarget();
    st.y = st.target;
    render();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(st.raf);
      window.clearTimeout(st.stopTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const strandA = useMemo(() => strandPath(box), [box]);
  const strandB = useMemo(() => strandPath(box, 0.6, 1.6), [box]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 z-30 h-[100svh] w-9 motion-reduce:hidden sm:w-16"
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${box.w} ${box.h}`} fill="none" className="overflow-visible">
        <defs>
          <linearGradient id="louse-strand-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6B4A36" stopOpacity="0" />
            <stop offset="0.12" stopColor="#6B4A36" stopOpacity="0.55" />
            <stop offset="0.88" stopColor="#6B4A36" stopOpacity="0.55" />
            <stop offset="1" stopColor="#6B4A36" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={strandA} stroke="url(#louse-strand-fade)" strokeWidth="2" strokeLinecap="round" />
        <path d={strandB} stroke="url(#louse-strand-fade)" strokeWidth="1" strokeOpacity=".45" strokeLinecap="round" />

        <g ref={louseRef} style={{ pointerEvents: "auto", cursor: "pointer" }}>
          {/* invisible hit area */}
          <circle
            r="22"
            fill="transparent"
            onPointerEnter={(e) => e.pointerType === "mouse" && panicRef.current()}
            onPointerDown={() => panicRef.current()}
          />
          <g style={{ pointerEvents: "none" }}>
            <LouseGlyph />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* ======================================================================
 * LouseOnStrand — static illustration (hero, 404): the louse bobbing on
 * its strand. Hover it to make it panic.
 * ==================================================================== */

const STRAND_A = "M32 4C27 29 37 48 32 69S27 110 33 132s-4 44-1 64";
const STRAND_B = "M34 5C29 30 39 49 34 70s-5 41 1 62-4 43-1 62";

export function LouseOnStrand({
  className,
  crawling = true,
}: {
  className?: string | undefined;
  crawling?: boolean;
}) {
  const [panic, setPanic] = useState(false);
  const trigger = () => {
    if (panic) return;
    setPanic(true);
    window.setTimeout(() => setPanic(false), 650);
  };

  return (
    <div aria-hidden="true" className={cn("pointer-events-none", className)}>
      <svg
        viewBox="0 0 64 200"
        fill="none"
        className={cn("h-full w-full overflow-visible", crawling && "louse-crawl", panic && "louse-panic")}
      >
        <g transform="translate(11 0)">
          <path d={STRAND_A} stroke="#6B4A36" strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />
          <path d={STRAND_B} stroke="#6B4A36" strokeOpacity=".25" strokeWidth="1" strokeLinecap="round" />
          <g transform="translate(32 64)">
            <g className="louse-bob">
              <g style={{ pointerEvents: "auto", cursor: "pointer" }} onPointerEnter={trigger} onPointerDown={trigger}>
                <circle r="24" fill="transparent" />
                <g transform="scale(1.25)" style={{ pointerEvents: "none" }}>
                  <LouseGlyph />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}