import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Phone,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { CtaBanner, PageHeader } from "@/components/site/Bits";
import { Pill, Section, SectionHeading } from "@/components/site/Kit";
import { PriceEstimator } from "@/components/site/PriceEstimator";
import { PriceList } from "@/components/site/PriceList";
import { Reveal } from "@/components/site/Reveal";
import { HairStrand, Highlight } from "@/components/site/Strand";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/assets";
import { services, site } from "@/lib/site";
import { FAMILY_DISCOUNT_PER_ADDITIONAL_PERSON, travelZones } from "@/lib/travel-fees";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services anti-poux à Toulouse — Poux Chrono 31" },
      {
        name: "description",
        content:
          "Traitement à domicile, dépistage et intervention en école. Des solutions douces et efficaces en Haute-Garonne.",
      },
      { property: "og:title", content: "Nos services anti-poux — Poux Chrono 31" },
      {
        property: "og:description",
        content: "Traitement à domicile, dépistage et collectivités à Toulouse.",
      },
    ],
  }),
  component: ServicesPage,
});

/* ================================================================ Data */

const serviceIcons: Record<string, LucideIcon> = {
  "traitement-domicile": Home,
  "diagnostic-depistage": Search,
  collectivite: Users,
};

/** Colour per travel zone (pills, dots, rings). */
const zoneStyle = [
  { hex: "#7fb3ff", dot: "bg-[#7fb3ff]", pill: "bg-[#7fb3ff]/12 ring-[#7fb3ff]/30" },
  { hex: "#F5A524", dot: "bg-star", pill: "bg-star/12 ring-star/30" },
  { hex: "#ff8a8a", dot: "bg-[#ff8a8a]", pill: "bg-[#ff8a8a]/12 ring-[#ff8a8a]/30" },
];
const COLOMIERS = -1;

/* ============================================================= Helpers */

/** Cursor-following glow — parent needs `group/spot relative isolate overflow-hidden`. */
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
        background: `radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 45%)`,
      }}
    />
  );
}

/* ================================================================ Page */

function ServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Nos services" }]}
        highlight="adaptée"
        eyebrow="Nos services"
        titre="Une solution adaptée à chaque situation"
        intro="Un simple doute, toute une famille à traiter ou une école à accompagner : on vient à vous, avec des produits doux et une méthode éprouvée."
      />

      <Overview />

      {/* The wrapper bounds the sticky switcher to the services list */}
      <div className="relative">
        <ServiceSwitcher />
        <div className="section-x space-y-8 py-12 md:space-y-10 md:py-16">
          {services.map((s, i) => (
            <ServiceArticle key={s.slug} service={s} index={i} />
          ))}
        </div>
      </div>

      <Pricing />

      <Section tone="tint" id="estimation" className="overflow-hidden">
        <SectionHeading title={<>Estimez votre <Highlight>tarif</Highlight></>} />
        <Reveal delay={100} className="relative mt-12">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-x-10 -inset-y-10 -z-10">
            <div className="absolute top-0 left-0 size-72 rounded-full bg-mint-soft blur-3xl" />
            <div className="absolute right-0 bottom-0 size-72 rounded-full bg-accent blur-3xl" />
          </div>
          <PriceEstimator />
        </Reveal>
      </Section>

      <CtaBanner />
    </>
  );
}

/* ============================================================ Overview */

function Overview() {
  return (
    <div className="section-x relative z-10 -mt-6 md:-mt-10">
      <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
        {services.map((s, i) => {
          const Icon = serviceIcons[s.slug] ?? Home;
          return (
            <Reveal key={s.slug} delay={i * 100} className="w-[80%] shrink-0 snap-start min-[480px]:w-[55%] md:w-auto">
              <a
                href={`#${s.slug}`}
                onPointerMove={spotlight}
                className="group/spot relative isolate flex h-full items-center gap-4 overflow-hidden rounded-[1.75rem] bg-white p-3 pr-5 shadow-card ring-1 ring-border/60 transition-transform duration-500 hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none"
              >
                <Spot />
                <div className="size-20 shrink-0 overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-mint-soft to-accent md:size-24">
                  <img
                    src={images.services[s.slug]}
                    alt=""
                    loading="lazy"
                    width={1448}
                    height={1086}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/spot:scale-110"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-mint-ink uppercase">
                    <Icon className="size-3.5" /> 0{i + 1}
                  </p>
                  <p className="mt-1 font-display text-lg leading-tight font-semibold text-navy">{s.titre}</p>
                  <p className="mt-1 text-sm font-bold text-primary">{s.prix}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-all duration-500 group-hover/spot:rotate-45 group-hover/spot:bg-primary group-hover/spot:text-white"
                >
                  <ArrowUpRight className="size-5" />
                </span>
              </a>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* ===================================================== Sticky switcher */

function ServiceSwitcher() {
  const [active, setActive] = useState<string>(services[0]?.slug ?? "");
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);

  // Move the sliding pill + keep the active tab visible on mobile.
  useEffect(() => {
    const update = () => {
      const nav = navRef.current;
      const el = nav?.querySelector<HTMLElement>(`a[href="#${active}"]`);
      if (!nav || !el) return;
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
      if (nav.scrollWidth > nav.clientWidth) {
        nav.scrollTo({ left: el.offsetLeft - 12, behavior: "smooth" });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

  useEffect(() => {
    const els = services
      .map((s) => document.getElementById(s.slug))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="sticky top-[4.25rem] z-30 pt-6 lg:top-[5.25rem]">
      <div className="section-x">
        <nav
          ref={navRef}
          aria-label="Nos services"
          className="no-scrollbar relative mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-white/70 bg-white/85 p-1.5 shadow-card backdrop-blur-xl"
        >
          <span
            aria-hidden="true"
            className="absolute top-1.5 bottom-1.5 rounded-full bg-navy shadow-soft transition-[left,width] duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {services.map((s) => {
            const Icon = serviceIcons[s.slug] ?? Home;
            const isActive = active === s.slug;
            return (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative z-10 flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-bold whitespace-nowrap transition-colors duration-300 md:px-5",
                  isActive ? "text-white" : "text-navy/70 hover:text-navy",
                )}
              >
                <Icon className={cn("size-4 transition-colors", isActive ? "text-mint" : "text-primary/60")} />
                {s.titre}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/* ============================================================= Article */

function ServiceArticle({ service: s, index: i }: { service: (typeof services)[number]; index: number }) {
  const reversed = i % 2 === 1;
  const Icon = serviceIcons[s.slug] ?? Home;

  return (
    <article
      id={s.slug}
      className={cn(
        "relative isolate scroll-mt-40 overflow-hidden rounded-[2.5rem] p-5 sm:p-8 lg:p-12",
        reversed
          ? "bg-gradient-to-br from-mint-soft/80 via-white to-white ring-1 ring-mint/20"
          : "bg-gradient-to-br from-accent/70 via-white to-white ring-1 ring-primary/10",
      )}
    >
      {/* Huge outline number */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-6 -z-10 font-display text-[10rem] leading-none font-bold text-transparent md:text-[14rem]",
          reversed ? "left-4" : "right-4",
        )}
        style={{ WebkitTextStroke: "1.5px rgb(31 79 176 / 0.10)" }}
      >
        0{i + 1}
      </span>

      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Visual */}
        <Reveal variant="scale" className={cn("relative", reversed && "lg:order-2")}>
          <div className="rounded-[2.25rem] bg-gradient-to-br from-mint/40 via-white to-primary/25 p-1.5 shadow-card md:p-2">
            <div className="group relative overflow-hidden rounded-[1.9rem] bg-gradient-to-br from-mint-soft to-accent">
              <img
                src={images.services[s.slug]}
                alt={s.titre}
                loading="lazy"
                width={1448}
                height={1086}
                className="aspect-[4/3] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              {/* Audience glass panel */}
              <div className="glass absolute inset-x-3 bottom-3 flex items-start gap-3 rounded-2xl p-3 shadow-soft md:inset-x-4 md:bottom-4 md:p-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Users className="size-4" />
                </span>
                <p className="text-sm leading-snug font-semibold text-navy">{s.public}</p>
              </div>
            </div>
          </div>
          <Pill tone="glass" className="absolute -top-3 left-6 animate-float px-4 py-2 text-base text-primary shadow-card">
            {s.prix}
          </Pill>
          <Pill
            tone="glass"
            icon={Clock}
            className="absolute -top-3 right-6 animate-float shadow-card [animation-delay:-3s]"
          >
            {s.duree}
          </Pill>
        </Reveal>

        {/* Copy */}
        <div>
          <Reveal className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-navy text-white shadow-soft">
              <Icon className="size-5" />
            </span>
            <p className="font-display text-sm font-bold tracking-[0.2em] text-mint-ink">
              0{i + 1} / 0{services.length}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-5 text-display-lg text-navy">{s.titre}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">{s.resume}</p>
          </Reveal>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {s.details.map((d, j) => (
              <Reveal
                as="li"
                key={d}
                delay={120 + j * 90}
                className="group/item flex gap-3 rounded-2xl bg-white/90 p-4 shadow-soft ring-1 ring-border/60 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-mint-soft transition-colors duration-300 group-hover/item:bg-mint">
                  <CheckCircle2 className="size-4 text-mint-ink transition-colors duration-300 group-hover/item:text-white" />
                </span>
                <span className="text-sm leading-relaxed text-navy/85 md:text-[0.95rem]">{d}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={500} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="cta" size="lg" className="w-full sm:w-auto">
              <Link to="/contact" search={s.slug === "collectivite" ? { service: s.slug } : {}}>
                {s.slug === "collectivite" ? "Demander un devis" : "Réserver ce service"}
                <ArrowRight data-arrow />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <a href={site.phoneHref}>
                <Phone className="text-primary" /> {site.phoneDisplay}
              </a>
            </Button>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

/* ============================================================= Pricing */

function FamilyVisual() {
  const people = [0, 1, 2];
  return (
    <div aria-hidden="true" className="mt-7 flex items-end gap-3">
      {people.map((p) => (
        <div key={p} className="flex flex-col items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap",
              p === 0 ? "bg-white/10 text-white/80" : "bg-mint text-navy",
            )}
          >
            {p === 0 ? "1ʳᵉ" : `−${FAMILY_DISCOUNT_PER_ADDITIONAL_PERSON} €`}
          </span>
          <svg viewBox="0 0 40 52" className={cn(p === 0 ? "h-16" : p === 1 ? "h-14" : "h-11")}>
            <circle cx="20" cy="13" r="10" fill={p === 0 ? "#ffffff" : "#57AE8C"} fillOpacity={p === 0 ? 0.9 : 1} />
            <path d="M2 52c0-14 8-22 18-22s18 8 18 22z" fill={p === 0 ? "#ffffff" : "#57AE8C"} fillOpacity={p === 0 ? 0.9 : 1} />
          </svg>
        </div>
      ))}
    </div>
  );
}

function ZoneMap({ active, onSelect }: { active: number | null; onSelect: (z: number | null) => void }) {
  const radii = [54, 82, 110];
  const opacityFor = (z: number) => (active === null ? 0.22 : active === z ? 0.45 : 0.08);

  return (
    <svg viewBox="0 0 240 240" className="mx-auto w-full max-w-[16rem]" role="img" aria-label="Zones de déplacement autour de Colomiers">
      {[...radii].reverse().map((r, idx) => {
        const z = radii.length - 1 - idx;
        const color = zoneStyle[z]?.hex ?? "#ffffff";
        return (
          <g key={r} className="cursor-pointer" onClick={() => onSelect(active === z ? null : z)}>
            <circle
              cx="120"
              cy="120"
              r={r}
              fill={color}
              fillOpacity={opacityFor(z)}
              stroke={color}
              strokeOpacity={active === z ? 1 : 0.5}
              strokeWidth={active === z ? 2.5 : 1.5}
              strokeDasharray={active === z ? undefined : "4 5"}
              style={{ transition: "all 400ms cubic-bezier(.22,1,.36,1)" }}
            />
            <text x="120" y={120 - r + 17} textAnchor="middle" className="fill-white text-[11px] font-bold">
              {z + 1}
            </text>
          </g>
        );
      })}
      <g className="cursor-pointer" onClick={() => onSelect(active === COLOMIERS ? null : COLOMIERS)}>
        <circle
          cx="120"
          cy="120"
          r="28"
          fill="#57AE8C"
          fillOpacity={active === null || active === COLOMIERS ? 1 : 0.4}
          style={{ transition: "all 400ms" }}
        />
        <circle cx="120" cy="112" r="4" fill="#0D1B3E" />
        <path d="M120 108a8 8 0 0 0-8 8c0 6 8 13 8 13s8-7 8-13a8 8 0 0 0-8-8z" fill="none" stroke="#0D1B3E" strokeWidth="2" transform="translate(0 -8)" />
        <text x="120" y="135" textAnchor="middle" className="fill-navy text-[9px] font-bold">
          Colomiers
        </text>
      </g>
    </svg>
  );
}

function Pricing() {
  const [zone, setZone] = useState<number | null>(null);
  const dim = (z: number) => zone !== null && zone !== z;

  return (
    <Section tone="navy" id="tarifs">
      <SectionHeading
        dark
        title={<>Tarifs du traitement à <Highlight tone="white">domicile</Highlight></>}
        intro="Prix par personne. Frais de déplacement selon la commune."
      />
      <Reveal delay={100} className="mx-auto mt-12 max-w-4xl">
        <PriceList />
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Family */}
        <Reveal as="section" className="glass-dark relative isolate overflow-hidden rounded-[1.75rem] p-6 md:p-8">
          <div aria-hidden="true" className="absolute -right-16 -bottom-16 -z-10 size-56 rounded-full bg-mint/20 blur-3xl" />
          <h3 className="text-display-md text-white">Tarif famille</h3>
          <p className="mt-3 text-white/65">Pour plusieurs personnes traitées lors de la même intervention :</p>
          <FamilyVisual />
          <ul className="mt-7 space-y-3 text-white/85">
            <li className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-mint" />
              1ʳᵉ personne : tarif normal selon la longueur des cheveux
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-mint" />
              <span>
                À partir de la 2ᵉ personne :{" "}
                <strong className="text-white">{FAMILY_DISCOUNT_PER_ADDITIONAL_PERSON} € de réduction par personne</strong>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-mint" />
              <span>
                Offre valable pour les personnes traitées{" "}
                <strong className="text-white">le même jour et à la même adresse</strong>
              </span>
            </li>
          </ul>
          <HairStrand className="mt-8 h-3 w-full text-mint/40" waves={8} amplitude={4} />
        </Reveal>

        {/* Travel fees — interactive map + list */}
        <Reveal as="section" delay={120} className="glass-dark rounded-[1.75rem] p-6 md:p-8">
          <h3 className="flex items-center gap-3 text-display-md text-white">
            <MapPin className="size-6 text-mint" /> Frais de déplacement
          </h3>

          <div className="mt-6 grid items-center gap-8 md:grid-cols-[14rem_minmax(0,1fr)]">
            <ZoneMap active={zone} onSelect={setZone} />

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setZone(zone === COLOMIERS ? null : COLOMIERS)}
                aria-pressed={zone === COLOMIERS}
                className={cn(
                  "w-full cursor-pointer rounded-2xl p-3 text-left ring-1 transition-all duration-300",
                  zone === COLOMIERS ? "bg-mint/15 ring-mint/50" : "ring-white/10 hover:bg-white/5",
                  dim(COLOMIERS) && "opacity-40",
                )}
              >
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="size-2.5 rounded-full bg-mint" />
                  <strong>Colomiers : offert</strong>
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  <li className="rounded-full bg-mint/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-mint/30">
                    Colomiers
                  </li>
                </ul>
              </button>

              {travelZones.map((tz, z) => (
                <button
                  type="button"
                  key={tz.label}
                  onClick={() => setZone(zone === z ? null : z)}
                  aria-pressed={zone === z}
                  className={cn(
                    "w-full cursor-pointer rounded-2xl p-3 text-left ring-1 transition-all duration-300",
                    zone === z ? "bg-white/[0.08] ring-white/30" : "ring-white/10 hover:bg-white/5",
                    dim(z) && "opacity-40",
                  )}
                >
                  <p className="flex items-center gap-2 text-sm font-bold text-white">
                    <span className={cn("size-2.5 rounded-full", zoneStyle[z]?.dot)} />
                    <strong>{tz.label} :</strong>
                  </p>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {tz.towns.map((t) => (
                      <li
                        key={t}
                        className={cn("rounded-full px-3 py-1.5 text-xs font-semibold text-white ring-1", zoneStyle[z]?.pill)}
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}

              <p className="flex items-center gap-2 px-3 pt-1 text-sm font-bold text-white">
                <span className="size-2.5 rounded-full bg-white/40" />
                <strong>Toutes les autres communes : sur devis</strong>
              </p>
            </div>
          </div>

          <p className="mt-6 border-t border-white/10 pt-5 text-sm text-white/60">
            Les frais de déplacement sont facturés une seule fois par adresse, quel que soit le nombre de personnes traitées.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}