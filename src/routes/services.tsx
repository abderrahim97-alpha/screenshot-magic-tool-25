import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, MapPin, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CtaBanner, PageHeader } from "@/components/site/Bits";
import { Pill, Section, SectionHeading } from "@/components/site/Kit";
import { PriceEstimator } from "@/components/site/PriceEstimator";
import { PriceList } from "@/components/site/PriceList";
import { Reveal } from "@/components/site/Reveal";
import { HairStrand, Highlight } from "@/components/site/Strand";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/assets";
import { services } from "@/lib/site";
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

/** Colour per travel zone (pills + dot). */
const zoneStyle = [
  { dot: "bg-[#7fb3ff]", pill: "bg-[#7fb3ff]/12 ring-[#7fb3ff]/30" },
  { dot: "bg-star", pill: "bg-star/12 ring-star/30" },
  { dot: "bg-[#ff8a8a]", pill: "bg-[#ff8a8a]/12 ring-[#ff8a8a]/30" },
];

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

      {/* The wrapper bounds the sticky switcher to the services list */}
      <div>
        <ServiceSwitcher />
        <div className="section-x space-y-24 py-16 md:space-y-32 md:py-24">
          {services.map((s, i) => (
            <ServiceArticle key={s.slug} service={s} index={i} />
          ))}
        </div>
      </div>

      <Pricing />

      <Section>
        <SectionHeading
          title={
            <>
              Estimez votre <Highlight>tarif</Highlight>
            </>
          }
        />
        <Reveal delay={100} className="mt-12">
          <PriceEstimator />
        </Reveal>
      </Section>

      <CtaBanner />
    </>
  );
}

/* ---------------------------------------------------- Sticky switcher */

function ServiceSwitcher() {
  const [active, setActive] = useState<string>(services[0]?.slug ?? "");
  const navRef = useRef<HTMLElement>(null);

  // Keep the active tab visible when the switcher scrolls horizontally (mobile).
  useEffect(() => {
    const nav = navRef.current;
    const el = nav?.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (nav && el && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: el.offsetLeft - 12, behavior: "smooth" });
    }
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
    <div className="sticky top-[4.25rem] z-30 lg:top-[5.25rem]">
      <div className="section-x">
        <nav
          ref={navRef}
          aria-label="Nos services"
          className="no-scrollbar mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-white/70 bg-white/85 p-1.5 shadow-card backdrop-blur-xl"
        >
          {services.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              aria-current={active === s.slug ? "true" : undefined}
              className={cn(
                "flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-bold whitespace-nowrap transition-colors duration-300 md:px-5",
                active === s.slug ? "bg-navy text-white" : "text-navy/70 hover:text-navy",
              )}
            >
              {s.titre}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- Article */

function ServiceArticle({ service: s, index: i }: { service: (typeof services)[number]; index: number }) {
  const reversed = i % 2 === 1;
  return (
    <article
      id={s.slug}
      className="grid scroll-mt-36 items-center gap-10 lg:grid-cols-2 lg:gap-16"
    >
      <Reveal variant="scale" className={cn("relative", reversed && "lg:order-2")}>
        <div className="rounded-[2.5rem] bg-gradient-to-br from-mint-soft via-white to-accent p-3 shadow-card">
          <div className="overflow-hidden rounded-[2rem]">
            <img
              src={images.services[s.slug]}
              alt={s.titre}
              loading="lazy"
              width={928}
              height={720}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
        <Pill tone="glass" className="absolute -top-3 left-6 animate-float px-4 py-2 text-base text-primary">
          {s.prix}
        </Pill>
        <Pill
          tone="glass"
          icon={Clock}
          className="absolute right-6 -bottom-4 animate-float [animation-delay:-3s]"
        >
          {s.duree}
        </Pill>
      </Reveal>

      <div>
        <Reveal>
          <p className="font-display text-sm font-bold tracking-[0.2em] text-mint-ink">
            0{i + 1} / 0{services.length}
          </p>
          <h2 className="mt-3 text-display-lg text-navy">{s.titre}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground md:text-xl">{s.resume}</p>
          <p className="mt-5 inline-flex items-start gap-2 rounded-2xl bg-accent/70 px-4 py-2.5 text-sm font-semibold text-navy">
            <Users className="mt-0.5 size-4 shrink-0 text-primary" /> {s.public}
          </p>
        </Reveal>
        <ul className="mt-7 space-y-3">
          {s.details.map((d, j) => (
            <Reveal
              as="li"
              key={d}
              delay={120 + j * 90}
              className="flex gap-3 rounded-2xl border border-border/60 bg-white px-4 py-3.5 shadow-soft"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint-ink" />
              <span className="text-navy/85">{d}</span>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={500} className="mt-8">
          <Button asChild variant="cta" size="lg" className="w-full sm:w-auto">
            <Link to="/contact" search={s.slug === "collectivite" ? { service: s.slug } : {}}>
              {s.slug === "collectivite" ? "Demander un devis" : "Réserver ce service"}
              <ArrowRight data-arrow />
            </Link>
          </Button>
        </Reveal>
      </div>
    </article>
  );
}

/* -------------------------------------------------------- Pricing */

function Pricing() {
  return (
    <Section tone="navy" id="tarifs">
      <SectionHeading
        dark
        title={
          <>
            Tarifs du traitement à <Highlight tone="white">domicile</Highlight>
          </>
        }
        intro="Prix par personne. Frais de déplacement selon la commune."
      />
      <Reveal delay={100} className="mx-auto mt-12 max-w-4xl">
        <PriceList />
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal as="section" className="glass-dark rounded-[1.75rem] p-6 md:p-8">
          <h3 className="text-display-md text-white">Tarif famille</h3>
          <p className="mt-3 text-white/65">
            Pour plusieurs personnes traitées lors de la même intervention :
          </p>
          <ul className="mt-6 space-y-3 text-white/85">
            <li className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-mint" />
              1ʳᵉ personne : tarif normal selon la longueur des cheveux
            </li>
            <li className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rounded-full bg-mint" />
              <span>
                À partir de la 2ᵉ personne :{" "}
                <strong className="text-white">
                  {FAMILY_DISCOUNT_PER_ADDITIONAL_PERSON} € de réduction par personne
                </strong>
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

        <Reveal as="section" delay={120} className="glass-dark rounded-[1.75rem] p-6 md:p-8">
          <h3 className="flex items-center gap-3 text-display-md text-white">
            <MapPin className="size-6 text-mint" /> Frais de déplacement
          </h3>
          <div className="mt-6 space-y-5">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-white">
                <span className="size-2.5 rounded-full bg-mint" />
                <strong>Colomiers : offert</strong>
              </p>
              <ul className="mt-2.5 flex flex-wrap gap-2">
                <li className="rounded-full bg-mint/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-mint/30">
                  Colomiers
                </li>
              </ul>
            </div>
            {travelZones.map((zone, z) => (
              <div key={zone.label}>
                <p className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className={cn("size-2.5 rounded-full", zoneStyle[z]?.dot)} />
                  <strong>{zone.label} :</strong>
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-2">
                  {zone.towns.map((t) => (
                    <li
                      key={t}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-semibold text-white ring-1",
                        zoneStyle[z]?.pill,
                      )}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="size-2.5 rounded-full bg-white/40" />
              <strong>Toutes les autres communes : sur devis</strong>
            </p>
          </div>
          <p className="mt-6 border-t border-white/10 pt-5 text-sm text-white/60">
            Les frais de déplacement sont facturés une seule fois par adresse, quel que soit le
            nombre de personnes traitées.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
