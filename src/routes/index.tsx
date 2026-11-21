import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  Clock,
  HeartHandshake,
  Home,
  Leaf,
  MapPin,
  Phone,
  Plus,
  Search,
  Star,
  Users,
} from "lucide-react";

import { CtaBanner } from "@/components/site/Bits";
import { Card, IconBadge, Pill, Section, SectionHeading, StarRating } from "@/components/site/Kit";
import { LouseOnStrand } from "@/components/site/Louse";
import { PriceList } from "@/components/site/PriceList";
import { CountUp, Reveal } from "@/components/site/Reveal";
import { HairStrand, Highlight } from "@/components/site/Strand";
import { TestimonialCarousel } from "@/components/site/TestimonialCarousel";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/assets";
import { faq, site, villes } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Poux Chrono 31 — Traitement des poux à domicile à Toulouse (31)" },
      {
        name: "description",
        content:
          "Des poux ? On s'occupe de tout, souvent le jour même. Traitement à domicile doux et efficace à Toulouse et en Haute-Garonne, produits naturels, 7j/7.",
      },
      {
        property: "og:title",
        content: "Poux Chrono 31 — Traitement des poux à domicile à Toulouse",
      },
      {
        property: "og:description",
        content:
          "Intervention rapide à domicile, méthode douce adaptée aux enfants, résultats garantis. Toulouse et Haute-Garonne, 7j/7.",
      },
    ],
  }),
  component: Index,
});

const atouts = [
  {
    icon: Clock,
    titre: "Rapidité",
    texte: "On intervient le jour même dans la majorité des cas.",
  },
  {
    icon: Leaf,
    titre: "Sécurité",
    texte: "Produits naturels, sans danger pour les enfants dès le plus jeune âge.",
  },
  {
    icon: Home,
    titre: "Discrétion",
    texte: "À domicile, en toute intimité, et toujours sans jugement.",
  },
  {
    icon: BadgeCheck,
    titre: "Expertise",
    texte: "Équipe formée au dépistage et au traitement professionnels.",
  },
];

const etapes = [
  { titre: "Vous nous contactez", texte: "Par téléphone, WhatsApp ou formulaire, à toute heure." },
  { titre: "On fixe un rendez-vous", texte: "Rapidement, chez vous, au créneau qui vous arrange." },
  { titre: "Diagnostic et traitement", texte: "Chaque tête est examinée, puis traitée sur place." },
  {
    titre: "Conseils et suivi",
    texte: "Prévention expliquée simplement, contrôle offert si besoin.",
  },
];

const apercuServices = [
  {
    img: images.services["traitement-domicile"],
    icon: Home,
    titre: "Traitement à domicile",
    texte: "Toute la famille traitée en une seule visite.",
    prix: "à partir de 49 €",
  },
  {
    img: images.services["diagnostic-depistage"],
    icon: Search,
    titre: "Diagnostic & dépistage",
    texte: "Un doute ? On vérifie et on vous dit tout clairement.",
    prix: "19 € par personne",
  },
  {
    img: images.services["collectivite"],
    icon: Users,
    titre: "Intervention en collectivité",
    texte: "Écoles, crèches et centres de loisirs.",
    prix: "sur devis",
  },
];

function Index() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Atouts />
      <Etapes />
      <Services />
      <Tarifs />
      <Temoignages />
      <Faq />
      <CtaBanner className="pt-4" />
    </>
  );
}

/* ---------------------------------------------------------------- Hero */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-3 pb-14 md:pt-10 md:pb-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 -left-40 size-[38rem] rounded-full bg-accent blur-3xl" />
        <div className="absolute top-10 right-[-12rem] size-[34rem] rounded-full bg-mint-soft blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-[22rem] rounded-full bg-destructive/[0.05] blur-3xl" />
      </div>

      <div className="section-x grid items-center gap-6 md:grid-cols-[1.05fr_1fr] md:gap-10 lg:gap-16">
        {/* Visual — compact on top on mobile */}
        <div className="relative md:order-2">
          <div className="relative mx-auto w-full max-w-xl">
            <div
              className={cn(
                "relative overflow-hidden bg-gradient-to-br from-mint-soft to-accent shadow-card",
                "h-48 rounded-[1.75rem] min-[400px]:h-56 sm:h-72",
                "md:blob-mask md:aspect-[1/1.02] md:h-auto",
              )}
            >
              <img
                src={images.hero}
                alt="Un parent qui peigne doucement les cheveux de son enfant à la maison"
                width={1200}
                height={1008}
                fetchPriority="high"
                className="h-full w-full object-cover object-[50%_35%] md:object-center"
              />
            </div>

            <div className="absolute -bottom-3 left-3 flex flex-col gap-2 sm:left-5 md:-bottom-2 md:-left-6 md:gap-3">
              <Pill tone="glass" className="animate-float text-xs sm:text-sm">
                <Star className="size-4 fill-star text-star" aria-hidden="true" />
                4,9/5
              </Pill>
            </div>
            <div className="absolute -top-3 right-3 sm:right-5 md:top-10 md:-right-4">
              <Pill
                tone="glass"
                icon={Leaf}
                className="animate-float text-xs text-mint-ink [animation-delay:-3s] sm:text-sm"
              >
                Produits 100 % naturels
              </Pill>
            </div>

            <LouseOnStrand className="absolute top-[12%] -left-12 hidden h-60 w-20 md:block lg:-left-16" />
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col pt-2 md:order-1 md:pt-0">
          <Reveal load className="order-1">
            <Pill live tone="mint">
              Disponible aujourd'hui
            </Pill>
          </Reveal>
          <Reveal load as="h1" delay={80} className="order-2 mt-4 text-display-xl text-navy md:mt-6">
            Des poux ? On s'occupe de tout, <Highlight>aujourd'hui</Highlight>.
          </Reveal>
          <Reveal
            load
            as="p"
            delay={160}
            className="order-4 mt-5 text-lg leading-relaxed text-muted-foreground md:order-3 md:mt-6 md:text-xl"
          >
            Traitement doux, sans insecticide, adapté aux enfants comme aux adultes. On vient chez
            vous à Toulouse et partout en Haute-Garonne. Vous n'avez rien à préparer.
          </Reveal>
          <Reveal
            load
            delay={220}
            className="order-3 mt-6 flex flex-col gap-3 sm:flex-row md:order-4 md:mt-9"
          >
            <Button asChild variant="cta" size="lg">
              <Link to="/contact" search={{}}>
                Prendre rendez-vous
                <ArrowRight data-arrow />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={site.phoneHref}>
                <Phone className="text-primary" /> {site.phoneDisplay}
              </a>
            </Button>
          </Reveal>
          <Reveal
            load
            as="ul"
            delay={300}
            className="order-5 mt-7 flex flex-wrap gap-x-5 gap-y-2.5 text-sm font-semibold text-navy/75 md:mt-10"
          >
            <li className="flex items-center gap-2">
              <Home className="size-4 text-primary" /> Intervention à domicile
            </li>
            <li className="flex items-center gap-2">
              <Leaf className="size-4 text-mint-ink" /> Produits 100 % naturels
            </li>
            <li className="flex items-center gap-2">
              <CalendarClock className="size-4 text-primary" /> Disponible 7j/7
            </li>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ Trust bar */

function TrustBar() {
  const stats = [
    {
      big: <CountUp value={2000} prefix="+" grouping={false} />,
      label: "familles accompagnées",
    },
    { big: <CountUp value={4.9} decimals={1} suffix="/5" />, label: "Note moyenne" },
  ];
  const badges = [
    { icon: BadgeCheck, label: "Méthode certifiée" },
    { icon: HeartHandshake, label: "Intervenants formés et assurés" },
  ];

  return (
    <section aria-label="Chiffres clés" className="relative py-10 md:py-14">
      <div className="section-x">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 rounded-[2rem] border border-border/70 bg-white/70 px-5 py-8 shadow-soft backdrop-blur md:px-10 lg:grid-cols-4 lg:divide-x lg:divide-border/70 lg:px-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="text-center lg:px-6">
              <p className="font-display text-[clamp(2.25rem,6vw,3.5rem)] leading-none font-bold tracking-tight text-primary">
                {s.big}
              </p>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
          {badges.map((b, i) => (
            <Reveal
              key={b.label}
              delay={200 + i * 100}
              className="flex flex-col items-center gap-3 text-center lg:px-6"
            >
              <IconBadge icon={b.icon} tone={i === 0 ? "blue" : "mint"} />
              <p className="font-display text-base leading-snug font-semibold text-navy md:text-lg">
                {b.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Served towns marquee */}
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] md:mt-10">
        <ul className="sr-only">
          {villes.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
        <div
          aria-hidden="true"
          className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {[...villes, ...villes].map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap text-navy/75 shadow-soft ring-1 ring-border/60"
            >
              <MapPin className="size-3.5 text-mint-ink" />
              {v}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Atouts */

function Atouts() {
  const [rapidite, securite, discretion, expertise] = atouts as [
    (typeof atouts)[number],
    (typeof atouts)[number],
    (typeof atouts)[number],
    (typeof atouts)[number],
  ];

  return (
    <Section>
      <SectionHeading title={<>Pourquoi nous <Highlight>choisir</Highlight></>} />
      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(13rem,auto))]">
        {/* Big tile */}
        <Reveal className="relative isolate flex flex-col items-start overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-[#173d8c] p-7 text-white shadow-card md:col-span-2 md:p-10 lg:row-span-2">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="absolute -right-16 -bottom-16 size-72 rounded-full bg-mint/30 blur-3xl" />
            <rapidite.icon
              className="absolute -right-10 -bottom-10 size-72 text-white/[0.07] md:size-96"
              strokeWidth={1}
            />
            <HairStrand
              className="absolute top-1/2 left-0 h-8 w-full text-white/15"
              waves={5}
              amplitude={10}
              strokeWidth={1.5}
            />
          </div>
          <IconBadge icon={rapidite.icon} tone="white" size="lg" />
          <h3 className="mt-8 text-display-lg text-white lg:mt-auto">{rapidite.titre}</h3>
          <p className="mt-4 max-w-sm text-lg text-white/80 md:text-xl">{rapidite.texte}</p>
          <Pill tone="dark" live className="mt-8">
            Disponible aujourd'hui
          </Pill>
        </Reveal>

        <Reveal delay={100} className="md:col-span-2">
          <Card interactive className="flex h-full flex-col gap-5 border-mint/20 bg-mint-soft/70 sm:flex-row sm:items-center">
            <IconBadge icon={securite.icon} tone="mint" size="lg" />
            <div>
              <h3 className="text-display-md text-navy">{securite.titre}</h3>
              <p className="mt-2 text-muted-foreground">{securite.texte}</p>
            </div>
          </Card>
        </Reveal>

        {[discretion, expertise].map((a, i) => (
          <Reveal key={a.titre} delay={200 + i * 100}>
            <Card interactive className="flex h-full flex-col">
              <IconBadge icon={a.icon} tone="blue" />
              <h3 className="mt-6 text-xl text-navy md:text-2xl">{a.titre}</h3>
              <p className="mt-2 text-muted-foreground">{a.texte}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- Étapes */

function Etapes() {
  return (
    <Section id="comment-ca-marche" tone="tint">
      <SectionHeading title={<>Comment ça <Highlight>marche</Highlight></>} />

      <div className="relative mt-14 md:mt-16">
        {/* Horizontal strand (desktop) */}
        <HairStrand
          className="absolute top-7 right-[12%] left-[12%] hidden h-4 text-primary/30 lg:block"
          waves={9}
          amplitude={6}
          strokeWidth={2}
          delay={300}
        />
        {/* Vertical strand (mobile) */}
        <HairStrand
          vertical
          className="absolute top-4 bottom-4 left-[1.375rem] w-3 text-primary/25 md:hidden"
          waves={8}
          amplitude={4}
          strokeWidth={2}
        />

        <ol className="grid gap-8 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {etapes.map((e, i) => (
            <Reveal as="li" key={e.titre} delay={i * 140} className="relative pl-16 md:pl-0">
              <span className="absolute top-0 left-0 z-10 inline-flex size-14 items-center justify-center rounded-full bg-navy font-display text-xl font-bold text-white shadow-card ring-8 ring-background md:relative md:mx-auto md:flex lg:ring-[#f4f7fc]">
                {i + 1}
              </span>
              <div className="md:mt-6 md:h-[calc(100%-5rem)] md:rounded-[1.75rem] md:bg-white md:p-5 md:shadow-soft md:ring-1 md:ring-border/60">
                <div className="hidden aspect-[5/4] overflow-hidden rounded-2xl bg-gradient-to-br from-mint-soft to-accent md:block">
                  <img
                    src={images.etapes[i]}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <h3 className="pt-3 text-xl text-navy md:mt-5 md:pt-0 md:text-center">
                  {e.titre}
                </h3>
                <p className="mt-2 text-muted-foreground md:text-center">{e.texte}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal className="mt-12 flex justify-center">
        <Pill tone="mint" icon={BadgeCheck} className="px-5 py-2.5 text-base">
          Un seul rendez-vous suffit dans la majorité des cas.
        </Pill>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------ Services */

function Services() {
  return (
    <Section>
      <SectionHeading title={<>Nos <Highlight>services</Highlight></>} />
      <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
        {apercuServices.map((s, i) => (
          <Reveal
            key={s.titre}
            delay={i * 120}
            className="w-[82%] shrink-0 snap-start min-[480px]:w-[60%] md:w-auto"
          >
            <Link
              to="/services"
              className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint-soft to-accent shadow-card focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none md:aspect-[3/4.2]"
            >
              <img
                src={s.img}
                alt={s.titre}
                loading="lazy"
                width={928}
                height={720}
                className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/55 to-transparent to-75%"
              />
              <span className="glass absolute top-4 left-4 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-bold text-navy shadow-soft">
                {s.prix}
              </span>
              <span
                aria-hidden="true"
                className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-navy shadow-soft transition-transform duration-500 group-hover:rotate-45"
              >
                <ArrowUpRight className="size-5" />
              </span>
              <div className="p-6 text-white md:p-7">
                <IconBadge icon={s.icon} tone="white" size="sm" />
                <h3 className="mt-4 text-2xl text-white">{s.titre}</h3>
                <div className="grid transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="pt-2 text-white/80">{s.texte}</p>
                    <p className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-mint">
                      {s.prix} →
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- Tarifs */

function Tarifs() {
  return (
    <Section id="tarifs" tone="navy">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            dark
            title={<>Tarifs <Highlight tone="white">indicatifs</Highlight></>}
            intro="Aucun frais caché : un devis clair vous est annoncé avant toute intervention."
          />
          <Reveal delay={150} className="mt-8 flex items-start gap-3 rounded-2xl bg-white/[0.06] p-4 text-sm text-white/75 ring-1 ring-white/10">
            <MapPin className="mt-0.5 size-4 shrink-0 text-mint" />
            Frais de déplacement selon la zone, toujours communiqués à l'avance.
          </Reveal>
          <Reveal delay={200} className="mt-8">
            <Button asChild variant="cta" size="lg" className="w-full sm:w-auto">
              <Link to="/contact" search={{}}>
                Prendre rendez-vous
                <ArrowRight data-arrow />
              </Link>
            </Button>
          </Reveal>
        </div>
        <PriceList />
      </div>
    </Section>
  );
}

/* -------------------------------------------------------- Témoignages */

function Temoignages() {
  return (
    <Section tone="cream" className="overflow-hidden">
      <SectionHeading title={<>Ils nous ont <Highlight>appelés</Highlight></>} />
      <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8">
        <Reveal className="flex flex-col justify-between rounded-[1.75rem] bg-navy p-7 text-white shadow-card md:p-8">
          <div>
            <p className="font-display text-6xl leading-none font-bold tracking-tight md:text-7xl">
              <CountUp value={4.9} decimals={1} suffix="/5" />
            </p>
            <StarRating size="md" className="mt-4" />
            <p className="mt-3 text-white/70">Note moyenne</p>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="font-display text-3xl font-bold">
              <CountUp value={2000} prefix="+" grouping={false} />
            </p>
            <p className="text-white/70">familles accompagnées</p>
          </div>
        </Reveal>
        <Reveal delay={120} className="min-w-0">
          <TestimonialCarousel />
        </Reveal>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- FAQ */

function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            title={<>Vos questions, nos <Highlight>réponses</Highlight></>}
          />
          <Reveal as="p" delay={100} className="mt-6 text-muted-foreground">
            Une autre question ?{" "}
            <Link to="/contact" search={{}} className="font-bold text-primary underline-offset-4 hover:underline">
              Écrivez-nous
            </Link>{" "}
            ou lisez nos{" "}
            <Link to="/blog" className="font-bold text-primary underline-offset-4 hover:underline">
              articles
            </Link>
            .
          </Reveal>
        </div>

        <Reveal delay={100}>
          <AccordionPrimitive.Root type="single" collapsible className="border-t border-border">
            {faq.map((item) => (
              <AccordionPrimitive.Item key={item.q} value={item.q} className="border-b border-border">
                <AccordionPrimitive.Header>
                  <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-display text-lg font-semibold text-navy transition-colors hover:text-primary md:text-xl">
                    {item.q}
                    <span
                      aria-hidden="true"
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-[transform,background-color,color] duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-primary group-data-[state=open]:text-white"
                    >
                      <Plus className="size-5" />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="max-w-2xl pr-12 pb-6 leading-relaxed text-muted-foreground">
                    {item.r}
                  </p>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </Reveal>
      </div>
    </Section>
  );
}
