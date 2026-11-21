import { Star, type LucideIcon } from "lucide-react";
import type { ElementType, ReactNode } from "react";

import { Reveal } from "@/components/site/Reveal";
import { HairStrand } from "@/components/site/Strand";
import { cn } from "@/lib/utils";

type Tone = "light" | "navy" | "cream" | "tint";

const toneClass: Record<Tone, string> = {
  light: "bg-background text-foreground",
  tint: "bg-gradient-to-b from-background via-accent/40 to-background text-foreground",
  cream: "bg-cream text-foreground",
  navy: "grain bg-navy text-white",
};

/** Page section with consistent vertical rhythm and tone. */
export function Section({
  children,
  tone = "light",
  className,
  containerClassName,
  id,
  as: Tag = "section",
  bare = false,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string | undefined;
  containerClassName?: string;
  id?: string;
  as?: ElementType;
  /** Skip the inner container (for full-bleed content). */
  bare?: boolean;
}) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      className={cn("relative py-20 md:py-28", toneClass[tone], className)}
    >
      {tone === "navy" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-primary/40 blur-[120px]" />
          <div className="absolute -right-32 bottom-0 size-[26rem] rounded-full bg-mint/20 blur-[110px]" />
        </div>
      )}
      {bare ? children : <div className={cn("section-x", containerClassName)}>{children}</div>}
    </Tag>
  );
}

/** Eyebrow + title (with optional highlighted word) + intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  dark = false,
  className,
  as: Tag = "h2",
  size = "lg",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "center" | "left";
  dark?: boolean;
  className?: string | undefined;
  as?: "h1" | "h2" | "h3";
  size?: "xl" | "lg" | "md";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow dark={dark} className={align === "center" ? "justify-center" : undefined}>
          {eyebrow}
        </Eyebrow>
      )}
      <Tag
        className={cn(
          eyebrow && "mt-4",
          size === "xl" && "text-display-xl",
          size === "lg" && "text-display-lg",
          size === "md" && "text-display-md",
          dark ? "text-white" : "text-navy",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            align === "center" && "mx-auto max-w-xl",
            dark ? "text-white/70" : "text-muted-foreground",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

export function Eyebrow({
  children,
  dark = false,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string | undefined;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em]",
        dark ? "text-mint" : "text-mint-ink",
        className,
      )}
    >
      <HairStrand className="h-2.5 w-8 shrink-0" waves={2} amplitude={3} strokeWidth={2} />
      {children}
    </p>
  );
}

export function Card({
  children,
  className,
  as: Tag = "div",
  interactive = false,
}: {
  children: ReactNode;
  className?: string | undefined;
  as?: ElementType;
  interactive?: boolean;
}) {
  return (
    <Tag
      className={cn(
        "relative rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-soft md:p-7",
        interactive &&
          "transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-card",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

type PillTone = "mint" | "blue" | "white" | "glass" | "dark" | "red";

const pillTone: Record<PillTone, string> = {
  mint: "bg-mint-soft text-mint-ink",
  blue: "bg-accent text-primary",
  white: "bg-white text-navy shadow-soft",
  glass: "glass text-navy shadow-soft",
  dark: "bg-white/10 text-white ring-1 ring-white/15",
  red: "bg-destructive/10 text-destructive",
};

export function Pill({
  children,
  tone = "mint",
  live = false,
  icon: Icon,
  className,
}: {
  children: ReactNode;
  tone?: PillTone;
  /** Shows a pulsing "live" dot. */
  live?: boolean;
  icon?: LucideIcon;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold",
        pillTone[tone],
        className,
      )}
    >
      {live && (
        <span className="relative inline-flex size-2.5 shrink-0 rounded-full bg-mint text-mint animate-pulse-dot" />
      )}
      {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
      {children}
    </span>
  );
}

type BadgeTone = "blue" | "mint" | "red" | "dark" | "white";

const badgeTone: Record<BadgeTone, string> = {
  blue: "bg-gradient-to-br from-white to-accent text-primary ring-1 ring-primary/10 shadow-[inset_0_-2px_0_rgb(31_79_176/0.08)]",
  mint: "bg-gradient-to-br from-white to-mint-soft text-mint-ink ring-1 ring-mint/20 shadow-[inset_0_-2px_0_rgb(31_122_92/0.08)]",
  red: "bg-gradient-to-br from-white to-destructive/10 text-destructive ring-1 ring-destructive/15",
  dark: "bg-white/10 text-mint ring-1 ring-white/15",
  white: "bg-white/15 text-white ring-1 ring-white/25",
};

export function IconBadge({
  icon: Icon,
  tone = "blue",
  size = "md",
  className,
}: {
  icon: LucideIcon;
  tone?: BadgeTone;
  size?: "sm" | "md" | "lg";
  className?: string | undefined;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        size === "sm" && "size-10 rounded-xl",
        size === "md" && "size-12 rounded-2xl",
        size === "lg" && "size-16 rounded-[1.35rem]",
        badgeTone[tone],
        className,
      )}
    >
      <Icon
        className={cn(size === "sm" ? "size-5" : size === "md" ? "size-6" : "size-8")}
        strokeWidth={1.75}
      />
    </span>
  );
}

export function StarRating({
  value = 5,
  className,
  size = "sm",
}: {
  value?: number;
  className?: string | undefined;
  size?: "sm" | "md";
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-star", className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(size === "sm" ? "size-4" : "size-5", i < value ? "fill-current" : "opacity-30")}
        />
      ))}
      <span className="sr-only">{value} sur 5</span>
    </span>
  );
}
