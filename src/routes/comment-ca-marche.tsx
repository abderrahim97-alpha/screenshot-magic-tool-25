import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarClock,
  Car,
  HeartHandshake,
  Home,
  Leaf,
  Phone,
  ReceiptEuro,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { CtaBanner, PageHeader } from "@/components/site/Bits";
import { IconBadge, Section, SectionHeading } from "@/components/site/Kit";
import { Reveal } from "@/components/site/Reveal";
import { HairStrand, Highlight } from "@/components/site/Strand";
import { images } from "@/lib/assets";
import { cn } from "@/lib/utils";

const etapes = [
  {
    icon: Phone,
    titre: "Vous nous appelez",
    texte:
      "Un appel ou un message suffit. On vous écoute, on vous rassure et on estime avec vous la durée de l'intervention.",
  },
  {
    icon: CalendarClock,
    titre: "On fixe un créneau",
    texte:
      "Souvent le jour même, sinon le lendemain. Soir, week-end, veille d'école : on s'adapte à votre agenda.",
  },
  {
    icon: Home,
    titre: "On intervient chez vous",
    texte:
      "Diagnostic de chaque tête, lotion d'origine naturelle, puis peignage minutieux mèche par mèche. En douceur, sans stress.",
  },
  {
    icon: Search,
    titre: "On vérifie et on vous conseille",
    texte:
      "Contrôle final devant vous, conseils simples pour la maison et contrôle gratuit sous 10 jours si vous le souhaitez.",
  },
];

const engagements = [
  "Produits sans insecticide, adaptés dès 6 mois et aux femmes enceintes",
  "Intervenants formés, assurés et bienveillants",
  "Discrétion totale : véhicule non floqué",
  "Tarif annoncé = tarif payé",
];

const engagementIcons = [Leaf, HeartHandshake, Car, ReceiptEuro];

export const Route = createFileRoute("/comment-ca-marche")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — Traitement des poux en 4 étapes | Poux Chrono 31" },
      {
        name: "description",
        content:
          "De votre appel au contrôle final : découvrez notre méthode douce de traitement des poux à domicile à Toulouse, en 4 étapes simples.",
      },
      { property: "og:title", content: "Comment ça marche — Poux Chrono 31" },
      {
        property: "og:description",
        content: "Notre méthode de traitement des poux à domicile, en 4 étapes simples.",
      },
    ],
  }),
  component: HowPage,
});

/* ============================================================= Helpers */

function spotlight(e: ReactPointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Spot({ color = "rgb(31 79 176 / 0.10)" }: { color?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-[1] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
      style={{
        background: `radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 45%)`,
      }}
    />
  );
}

function scrollToStep(i: number) {
  document.getElementById(`etape-${i + 1}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ================================================================ Page */

function HowPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Comment ça marche" }]}
        highlight="sans stress"
        eyebrow="Notre méthode"
        titre="Simple, rapide et sans stress"
        intro="Vous n'avez rien à préparer. On s'occupe de tout, du premier appel jusqu'à la tranquillité retrouvée."
      />
      <Journey />
      <Timeline />
      <Engagements />
      <CtaBanner className="pt-16 md:pt-24" />
    </>
  );
}

/* ============================================== Journey (at a glance) */

function Journey() {
  return (
    <div className="section-x relative z-10 -mt-6 md:-mt-10">
      <Reveal className="relative overflow-hidden rounded-[2rem] bg-white/90 p-3 shadow-card ring-1 ring-border/60 backdrop-blur md:p-4">
        {/* Connecting strand (desktop) */}
        <HairStrand
          className="pointer-events-none absolute top-[2.9rem] right-[12%] left-[12%] hidden h-4 text-primary/25 lg:block"
          waves={10}
          amplitude={5}
          strokeWidth={2}
          delay={300}
        />
        <ol className="relative grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          {etapes.map((e, i) => (
            <li key={e.titre}>
              <button
                type="button"
                onClick={() => scrollToStep(i)}
                onPointerMove={spotlight}
                className="group/spot relative isolate flex h-full w-full cursor-pointer flex-col items-center gap-3 overflow-hidden rounded-[1.5rem] p-4 text-center transition-colors duration-300 hover:bg-accent/40 focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none lg:p-5"
              >
                <Spot />
                <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-white shadow-soft ring-1 ring-border/60 transition-transform duration-500 group-hover/spot:-translate-y-1 group-hover/spot:scale-105">
                  <e.icon className="size-6 text-primary" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 inline-flex size-6 items-center justify-center rounded-full bg-navy font-display text-xs font-bold text-white ring-2 ring-white">
                    {i + 1}
                  </span>
                </span>
                <span className="text-[0.7rem] font-bold tracking-[0.18em] text-mint-ink uppercase">
                  Étape {i + 1}
                </span>
                <span className="font-display text-sm leading-snug font-semibold text-navy md:text-base">
                  {e.titre}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}

/* ============================================================ Timeline */

function ProgressRing({ value }: { value: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 52 52" className="size-14 -rotate-90" aria-hidden="true">
      <circle cx="26" cy="26" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="4" />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value)}
        style={{ transition: "stroke-dashoffset 600ms cubic-bezier(.22,1,.36,1)" }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1F4FB0" />
          <stop offset="1" stopColor="#57AE8C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Timeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const list = listRef.current;
        if (!list) return;
        const anchor = window.innerHeight * 0.55;
        const rect = list.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
        if (fillRef.current) {
          fillRef.current.style.clipPath = `inset(0 -50% ${(1 - progress) * 100}% -50%)`;
        }
        const items = Array.from(list.querySelectorAll<HTMLElement>("[data-step]"));
        let current = 0;
        items.forEach((el, i) => {
          if (el.getBoundingClientRect().top < anchor) current = i;
        });
        setActive((prev) => (prev === current ? prev : current));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const current = etapes[active];

  return (
    <section className="relative py-12 md:py-20">
      {/* Mobile / tablet: sticky progress bar */}
      <div className="sticky top-[4.25rem] z-20 mb-6 lg:hidden">
        <div className="section-x">
          <div className="glass flex items-center gap-3 rounded-full px-3 py-2 shadow-card">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-white">
              {active + 1}
            </span>
            <p className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-navy">{current?.titre}</p>
            <div className="flex shrink-0 gap-1" aria-hidden="true">
              {etapes.map((e, i) => (
                <span
                  key={e.titre}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i <= active ? "w-5 bg-primary" : "w-2 bg-navy/15",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Sticky stage (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="relative rounded-[2.75rem] bg-gradient-to-br from-mint/40 via-white to-primary/25 p-2 shadow-card">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.4rem] bg-gradient-to-br from-mint-soft via-white to-accent">
                {etapes.map((e, i) => (
                  <img
                    key={e.titre}
                    src={images.etapes[i]}
                    alt=""
                    aria-hidden={i !== active}
                    loading={i === 0 ? "eager" : "lazy"}
                    width={1122}
                    height={1402}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-700 ease-out",
                      i === active ? "scale-100 opacity-100 blur-0" : "scale-[1.06] opacity-0 blur-sm",
                    )}
                  />
                ))}

                {/* Step dots */}
                <div className="glass absolute top-5 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full p-1.5 shadow-soft">
                  {etapes.map((e, i) => (
                    <button
                      key={e.titre}
                      type="button"
                      onClick={() => scrollToStep(i)}
                      aria-label={`Étape ${i + 1}`}
                      className={cn(
                        "h-2.5 cursor-pointer rounded-full transition-all duration-500",
                        i === active ? "w-8 bg-navy" : "w-2.5 bg-navy/20 hover:bg-navy/40",
                      )}
                    />
                  ))}
                </div>

                {/* Caption */}
                <div className="glass absolute right-5 bottom-5 left-5 flex items-center gap-4 rounded-2xl p-4 shadow-soft">
                  <div className="relative shrink-0 text-navy">
                    <ProgressRing value={(active + 1) / etapes.length} />
                    <span className="absolute inset-0 inline-flex items-center justify-center font-display text-lg font-bold">
                      {active + 1}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold tracking-[0.18em] text-mint-ink uppercase">
                      Étape {active + 1}/{etapes.length}
                    </p>
                    <p key={active} className="pc-word mt-0.5 font-display text-lg leading-snug font-semibold text-navy">
                      {current?.titre}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <HairStrand className="absolute -top-8 -right-6 h-10 w-44 text-primary/25" waves={3} amplitude={8} strokeWidth={2} />
          </div>
        </div>

        {/* Steps */}
        <ol ref={listRef} className="relative space-y-6 md:space-y-8">
          {/* Track + scroll-filled strand */}
          <span aria-hidden="true" className="absolute top-8 bottom-8 left-[0.875rem] w-4 md:left-[1.25rem]">
            <HairStrand
              vertical
              draw={false}
              className="absolute inset-0 h-full w-full text-navy/10"
              waves={10}
              amplitude={5}
              strokeWidth={2}
            />
            <span
              ref={fillRef}
              className="absolute inset-0 block transition-[clip-path] duration-150 ease-out"
              style={{ clipPath: "inset(0 -50% 100% -50%)" }}
            >
              <HairStrand vertical draw={false} className="h-full w-full text-primary" waves={10} amplitude={5} strokeWidth={3} />
            </span>
          </span>

          {etapes.map((e, i) => {
            const isActive = i === active;
            const done = i < active;
            return (
              <li key={e.titre} id={`etape-${i + 1}`} data-step className="relative scroll-mt-40 pl-12 md:pl-20">
                {/* Node */}
                <span
                  className={cn(
                    "absolute top-6 left-0 z-10 inline-flex size-11 items-center justify-center rounded-full font-display text-lg font-bold ring-[6px] ring-background transition-all duration-500 md:size-14 md:ring-8",
                    isActive && "scale-110 bg-primary text-white shadow-card",
                    done && "bg-navy text-white",
                    !isActive && !done && "bg-white text-navy/40 shadow-soft",
                  )}
                >
                  {isActive && (
                    <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-primary/30 motion-reduce:hidden" />
                  )}
                  <span className="relative">{i + 1}</span>
                </span>

                <Reveal>
                  <div
                    onPointerMove={spotlight}
                    className={cn(
                      "group/spot relative isolate overflow-hidden rounded-[1.75rem] bg-white p-5 transition-[box-shadow,opacity,transform] duration-500 md:rounded-[2rem] md:p-8",
                      isActive
                        ? "shadow-card ring-2 ring-primary/15 lg:-translate-y-1"
                        : "shadow-soft ring-1 ring-border/70 lg:opacity-60 lg:hover:opacity-100",
                    )}
                  >
                    <Spot />
                    {/* Active accent bar */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 top-0 h-1 origin-left bg-gradient-to-r from-primary to-mint transition-transform duration-700",
                        isActive ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                    {/* Big outline number */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -bottom-8 -z-[1] font-display text-[9rem] leading-none font-bold text-transparent md:text-[11rem]"
                      style={{ WebkitTextStroke: "1.5px rgb(31 79 176 / 0.08)" }}
                    >
                      {i + 1}
                    </span>

                    <div className="mb-5 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-mint-soft to-accent lg:hidden">
                      <img src={images.etapes[i]} alt="" loading="lazy" width={1122} height={1402} className="h-full w-full object-cover" />
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={cn("transition-transform duration-500", isActive && "-rotate-6 scale-110")}>
                        <IconBadge icon={e.icon} tone={isActive ? "blue" : "mint"} />
                      </div>
                      <p className="text-xs font-bold tracking-[0.18em] text-mint-ink uppercase">Étape {i + 1}</p>
                      {done && (
                        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-mint-soft px-2.5 py-1 text-xs font-bold text-mint-ink">
                          ✓
                        </span>
                      )}
                    </div>
                    <h2 className="mt-5 text-display-md text-navy">{e.titre}</h2>
                    <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">{e.texte}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ========================================================= Engagements */

function Engagements() {
  const [leaf, people, car, receipt] = engagements as [string, string, string, string];
  const [LeafIcon, PeopleIcon, CarIcon, ReceiptIcon] = engagementIcons as [
    typeof Leaf,
    typeof Leaf,
    typeof Leaf,
    typeof Leaf,
  ];
  const [left, right] = receipt.split("=").map((s) => s.trim());

  return (
    <Section tone="navy" className="overflow-hidden">
      <SectionHeading
        dark
        title={
          <span className="inline-flex items-center justify-center gap-3">
            <ShieldCheck className="size-9 shrink-0 text-mint md:size-11" />
            <span>
              Nos <Highlight tone="white">engagements</Highlight>
            </span>
          </span>
        }
      />

      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:grid-rows-[repeat(2,minmax(15rem,auto))]">
        {/* 1 — Big: natural products, animated shield */}
        <Reveal className="md:col-span-2 lg:col-span-1 lg:row-span-2">
          <div
            onPointerMove={spotlight}
            className="group/spot relative isolate flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-[#1d47a0] to-[#12306e] p-7 text-white shadow-card md:p-9"
          >
            <Spot color="rgb(255 255 255 / 0.10)" />
            <div aria-hidden="true" className="absolute inset-0 -z-[2]">
              <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-mint/30 blur-3xl" />
            </div>
            {/* Pulsing rings */}
            <div aria-hidden="true" className="relative mx-auto my-6 flex size-44 items-center justify-center md:size-52">
              {[0, 1, 2].map((r) => (
                <span
                  key={r}
                  className="absolute inset-0 animate-ping rounded-full border border-mint/40 motion-reduce:hidden"
                  style={{ animationDuration: "3s", animationDelay: `${r}s` }}
                />
              ))}
              <span className="absolute inset-6 rounded-full bg-white/[0.06] ring-1 ring-white/15" />
              <span className="relative inline-flex size-20 items-center justify-center rounded-full bg-mint text-navy shadow-card md:size-24">
                <LeafIcon className="size-10 md:size-12" />
              </span>
            </div>
            <div>
              <span aria-hidden="true" className="font-display text-sm font-bold tracking-widest text-white/50">01</span>
              <p className="mt-3 font-display text-2xl leading-snug font-semibold md:text-[1.7rem]">{leaf}</p>
            </div>
          </div>
        </Reveal>

        {/* 2 — People */}
        <Reveal delay={100}>
          <div
            onPointerMove={spotlight}
            className="glass-dark group/spot relative isolate flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-[2rem] p-7 text-white transition-transform duration-500 hover:-translate-y-1 md:p-8"
          >
            <Spot color="rgb(87 174 140 / 0.18)" />
            <PeopleIcon aria-hidden="true" strokeWidth={1} className="absolute -right-6 -bottom-6 -z-[1] size-40 text-white/[0.06] transition-transform duration-700 group-hover/spot:scale-110" />
            <div className="flex items-start justify-between">
              <IconBadge icon={PeopleIcon} tone="dark" />
              <span aria-hidden="true" className="font-display text-sm font-bold tracking-widest text-white/40">02</span>
            </div>
            <p className="mt-8 font-display text-xl leading-snug font-semibold md:text-2xl">{people}</p>
          </div>
        </Reveal>

        {/* 3 — Car (with driving animation) */}
        <Reveal delay={200}>
          <div
            onPointerMove={spotlight}
            className="glass-dark group/spot relative isolate flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-[2rem] p-7 text-white transition-transform duration-500 hover:-translate-y-1 md:p-8"
          >
            <Spot color="rgb(87 174 140 / 0.18)" />
            <div className="flex items-start justify-between">
              <IconBadge icon={CarIcon} tone="dark" />
              <span aria-hidden="true" className="font-display text-sm font-bold tracking-widest text-white/40">03</span>
            </div>
            <div aria-hidden="true" className="relative mt-6 h-8 overflow-hidden">
              <span className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/15" />
              <CarIcon className="absolute top-0 left-0 size-8 text-mint transition-[left] duration-[1600ms] ease-in-out group-hover/spot:left-[calc(100%-2rem)] motion-reduce:transition-none" />
            </div>
            <p className="mt-4 font-display text-xl leading-snug font-semibold md:text-2xl">{car}</p>
          </div>
        </Reveal>

        {/* 4 — Wide: price promise */}
        <Reveal delay={300} className="md:col-span-2">
          <div
            onPointerMove={spotlight}
            className="group/spot relative isolate flex h-full min-h-56 flex-col justify-between gap-6 overflow-hidden rounded-[2rem] bg-white p-7 text-navy shadow-card md:flex-row md:items-center md:p-9"
          >
            <Spot />
            <div className="flex items-start gap-4">
              <IconBadge icon={ReceiptIcon} tone="blue" />
              <span aria-hidden="true" className="font-display text-sm font-bold tracking-widest text-navy/30">04</span>
            </div>
            {left && right ? (
              <p className="flex flex-wrap items-center gap-3 font-display text-2xl leading-tight font-bold md:gap-5 md:text-4xl">
                <span className="rounded-2xl bg-accent px-4 py-2">{left}</span>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-mint text-3xl text-white shadow-soft transition-transform duration-500 group-hover/spot:rotate-180 md:size-14">
                  =
                </span>
                <span className="rounded-2xl bg-mint-soft px-4 py-2 text-mint-ink">{right}</span>
              </p>
            ) : (
              <p className="font-display text-2xl font-bold md:text-3xl">{receipt}</p>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}