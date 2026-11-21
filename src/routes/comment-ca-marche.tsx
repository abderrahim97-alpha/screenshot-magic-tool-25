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
import { useEffect, useRef, useState } from "react";

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
      <Timeline />
      <Engagements />
      <CtaBanner />
    </>
  );
}

/* --------------------------------------------------------- Timeline */

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

  return (
    <section className="section-x py-12 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Sticky illustration (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-mint-soft via-white to-accent shadow-card">
              {etapes.map((e, i) => (
                <img
                  key={e.titre}
                  src={images.etapes[i]}
                  alt=""
                  aria-hidden={i !== active}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out",
                    i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                  )}
                />
              ))}
              <div className="glass absolute right-5 bottom-5 left-5 flex items-center gap-4 rounded-2xl p-4 shadow-soft">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy font-display text-lg font-bold text-white">
                  {active + 1}
                </span>
                <p className="font-display text-lg font-semibold text-navy">
                  {etapes[active]?.titre}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <ol ref={listRef} className="relative space-y-6 md:space-y-8">
          {/* Track + scroll-filled strand */}
          <span
            aria-hidden="true"
            className="absolute top-8 bottom-8 left-[0.875rem] w-4 md:left-[1.25rem]"
          >
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
              <HairStrand
                vertical
                draw={false}
                className="h-full w-full text-primary"
                waves={10}
                amplitude={5}
                strokeWidth={3}
              />
            </span>
          </span>

          {etapes.map((e, i) => (
            <li key={e.titre} data-step className="relative pl-12 md:pl-20">
              <span
                className={cn(
                  "absolute top-6 left-0 z-10 inline-flex size-11 items-center justify-center rounded-full font-display text-lg font-bold ring-[6px] ring-background transition-colors duration-500 md:size-14 md:ring-8",
                  i <= active ? "bg-primary text-white" : "bg-white text-navy/40 shadow-soft",
                )}
              >
                {i + 1}
              </span>
              <Reveal
                className={cn(
                  "rounded-[1.5rem] border bg-white p-5 transition-[box-shadow,border-color,opacity] duration-500 md:rounded-[1.75rem] md:p-8",
                  i === active
                    ? "border-primary/20 shadow-card"
                    : "border-border/70 shadow-soft lg:opacity-70",
                )}
              >
                <div className="mb-5 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-mint-soft to-accent lg:hidden">
                  <img
                    src={images.etapes[i]}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <IconBadge icon={e.icon} tone={i === active ? "blue" : "mint"} />
                  <p className="text-xs font-bold tracking-[0.18em] text-mint-ink uppercase">
                    Étape {i + 1}
                  </p>
                </div>
                <h2 className="mt-5 text-display-md text-navy">{e.titre}</h2>
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{e.texte}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Engagements */

function Engagements() {
  return (
    <Section tone="navy">
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
      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
        {engagements.map((e, i) => {
          const Icon = engagementIcons[i] ?? ShieldCheck;
          const featured = i === 0 || i === 3;
          return (
            <Reveal
              key={e}
              delay={i * 100}
              className={cn(
                "group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 transition-transform duration-500 hover:-translate-y-1 md:min-h-56 md:p-9",
                featured
                  ? "bg-gradient-to-br from-primary to-[#173d8c] text-white shadow-card"
                  : "glass-dark text-white",
              )}
            >
              <Icon
                aria-hidden="true"
                className="absolute -right-6 -bottom-6 size-40 text-white/[0.06] transition-transform duration-700 group-hover:scale-110"
                strokeWidth={1}
              />
              <IconBadge icon={Icon} tone={featured ? "white" : "dark"} />
              <p className="mt-8 max-w-sm font-display text-xl leading-snug font-semibold md:text-2xl">
                {e}
              </p>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
