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
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Quote,
  Search,
  Star,
  Users,
} from "lucide-react";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { CtaBanner } from "@/components/site/Bits";
import { IconBadge, Pill, Section, SectionHeading, StarRating } from "@/components/site/Kit";
import { LouseOnStrand } from "@/components/site/Louse";
import { CountUp, Reveal } from "@/components/site/Reveal";
import { HairStrand, Highlight } from "@/components/site/Strand";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/assets";
import { faq, site, tarifs, temoignages, villes } from "@/lib/site";
import { FAMILY_DISCOUNT_PER_ADDITIONAL_PERSON } from "@/lib/travel-fees";
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

/* ================================================================ Data */

const atouts = [
  { icon: Clock, titre: "Rapidité", texte: "On intervient le jour même dans la majorité des cas." },
  {
    icon: Leaf,
    titre: "Sécurité",
    texte: "Produits naturels, sans danger pour les enfants dès le plus jeune âge.",
  },
  { icon: Home, titre: "Discrétion", texte: "À domicile, en toute intimité, et toujours sans jugement." },
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
  { titre: "Conseils et suivi", texte: "Prévention expliquée simplement, contrôle offert si besoin." },
];

const apercuServices = [
  {
    slug: "traitement-domicile",
    img: images.services["traitement-domicile"],
    icon: Home,
    titre: "Traitement à domicile",
    texte: "Toute la famille traitée en une seule visite.",
    prix: "à partir de 49 €",
  },
  {
    slug: "diagnostic-depistage",
    img: images.services["diagnostic-depistage"],
    icon: Search,
    titre: "Diagnostic & dépistage",
    texte: "Un doute ? On vérifie et on vous dit tout clairement.",
    prix: "19 € par personne",
  },
  {
    slug: "collectivite",
    img: images.services["collectivite"],
    icon: Users,
    titre: "Intervention en collectivité",
    texte: "Écoles, crèches et centres de loisirs.",
    prix: "sur devis",
  },
];

const avatarColors = ["bg-primary", "bg-mint", "bg-destructive", "bg-navy", "bg-[#7a5af5]"];

/* Read site.ts data defensively (field names normalised here). */
function pick(r: Record<string, unknown>, ...keys: string[]) {
  for (const k of keys) {
    const v = r[k];
    if (typeof v === "string" || typeof v === "number") return String(v);
  }
  return "";
}

type TarifRow = { type: string; detail: string; duree: string; prix: string; montant: number; aPartir: boolean };
const tarifRows: TarifRow[] = (tarifs as unknown as Record<string, unknown>[]).map((r) => {
  const raw = pick(r, "prix", "price", "tarif", "montant");
  const prix = raw.includes("€") ? raw : `${raw} €`;
  return {
    type: pick(r, "type", "titre", "label", "nom"),
    detail: pick(r, "detail", "description", "sousTitre"),
    duree: pick(r, "duree", "duration", "temps"),
    prix,
    montant: Number(raw.replace(/[^\d]/g, "")) || 0,
    aPartir: /partir/i.test(raw),
  };
});

type Avis = { nom: string; ville: string; texte: string };
const avis: Avis[] = (temoignages as unknown as Record<string, unknown>[]).map((r) => ({
  nom: pick(r, "nom", "prenom", "name", "auteur"),
  ville: pick(r, "ville", "town", "city", "lieu"),
  texte: pick(r, "texte", "citation", "quote", "avis", "message"),
}));

/* ============================================================== Helpers */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Cursor-following glow — put `group/spot relative overflow-hidden` on the parent. */
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

function Initial({ nom, i, className }: { nom: string; i: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white",
        avatarColors[i % avatarColors.length],
        className,
      )}
    >
      {nom.charAt(0)}
    </span>
  );
}

/* ================================================================ Page */

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

/* ================================================================ Hero */

const heroWords = ["Des", "poux", "?", "On", "s'occupe", "de", "tout,"];

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || reduced || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };
  const depth = (n: number): CSSProperties => ({
    transform: `translate3d(calc(var(--px, 0) * ${n}px), calc(var(--py, 0) * ${n}px), 0)`,
  });

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative isolate overflow-hidden pt-3 pb-12 md:pt-12 md:pb-24 lg:pb-32"
    >
      {/* Aurora + dotted grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="pc-aurora absolute -top-48 -left-40 size-[40rem] rounded-full bg-accent blur-3xl" />
        <div className="pc-aurora absolute top-0 right-[-14rem] size-[36rem] rounded-full bg-mint-soft blur-3xl [animation-delay:-6s]" />
        <div className="pc-aurora absolute bottom-[-10rem] left-1/3 size-[26rem] rounded-full bg-primary/[0.08] blur-3xl [animation-delay:-11s]" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgb(23_32_58/0.10)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="section-x grid grid-cols-[minmax(0,1fr)] items-center gap-7 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-10 lg:gap-16">
        {/* ---------- Visual */}
        <div className="relative min-w-0 md:order-2">
          <div className="relative mx-auto w-full max-w-xl">
            <div style={depth(8)} className="transition-transform duration-700 ease-out">
              <div className="rounded-[2.5rem] bg-gradient-to-br from-mint/50 via-white to-primary/30 p-1.5 shadow-card md:p-2">
                <div className="relative h-[38svh] max-h-80 min-h-56 overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-mint-soft to-accent sm:max-h-96 md:aspect-[1/1.02] md:h-auto md:max-h-none">
                  <img
                    src={images.hero}
                    alt="Un parent qui peigne doucement les cheveux de son enfant à la maison"
                    width={1200}
                    height={1008}
                    fetchPriority="high"
                    className="h-full w-full object-cover object-[50%_30%] md:object-center"
                  />

                  {/* Mobile: chips inside the image */}
                  <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 md:hidden">
                    <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-navy shadow-soft">
                      <Star className="size-3.5 fill-star text-star" aria-hidden="true" />
                      4,9/5
                    </span>
                    <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-mint-ink shadow-soft">
                      <Leaf className="size-3.5" aria-hidden="true" />
                      Produits 100 % naturels
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop floating cards */}
            <div style={depth(22)} className="absolute bottom-12 -left-10 hidden transition-transform duration-700 ease-out md:block lg:-left-14">
              <div className="glass animate-float rounded-2xl p-4 shadow-card">
                <div className="flex items-center">
                  {avis.slice(0, 4).map((a, i) => (
                    <Initial key={a.nom} nom={a.nom} i={i} className="-ml-2 size-9 text-sm ring-2 ring-white first:ml-0" />
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <StarRating />
                  <span className="font-display text-lg font-bold text-navy">4,9/5</span>
                </div>
                <p className="mt-0.5 text-xs font-semibold text-muted-foreground">+2000 familles accompagnées</p>
              </div>
            </div>

            <div style={depth(-16)} className="absolute top-8 -right-6 hidden transition-transform duration-700 ease-out md:block">
              <div className="glass animate-float flex items-center gap-3 rounded-2xl px-4 py-3 shadow-card [animation-delay:-2s]">
                <span className="relative flex size-3">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex size-3 rounded-full bg-mint" />
                </span>
                <div>
                  <p className="text-sm font-bold text-navy">Disponible 7j/7</p>
                  <p className="text-xs font-semibold text-muted-foreground">8h – 20h</p>
                </div>
              </div>
            </div>

            <div style={depth(14)} className="absolute right-10 -bottom-5 hidden transition-transform duration-700 ease-out md:block">
              <Pill tone="glass" icon={Leaf} className="animate-float text-sm text-mint-ink shadow-card [animation-delay:-4s]">
                Produits 100 % naturels
              </Pill>
            </div>

            <LouseOnStrand className="absolute top-[10%] -left-12 hidden h-60 w-20 lg:block xl:-left-16" />
          </div>
        </div>

        {/* ---------- Copy */}
        <div className="flex min-w-0 flex-col md:order-1">
          <Reveal load className="order-1">
            <Pill live tone="mint">
              Disponible aujourd'hui
            </Pill>
          </Reveal>

          <h1 className="order-2 mt-4 text-display-xl text-navy md:mt-6 lg:text-[clamp(3.5rem,5vw,4.9rem)] lg:leading-[1.02]">
            {heroWords.map((w, i) => (
              <Fragment key={`${w}-${i}`}>
                <span className="pc-word" style={{ animationDelay: `${60 + i * 55}ms` }}>
                  {w}
                </span>{" "}
              </Fragment>
            ))}
            <span className="pc-word" style={{ animationDelay: `${60 + heroWords.length * 55}ms` }}>
              <Highlight>aujourd'hui</Highlight>.
            </span>
          </h1>

          <Reveal
            load
            as="p"
            delay={420}
            className="order-4 mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground md:order-3 md:mt-6 md:text-xl"
          >
            Traitement doux, sans insecticide, adapté aux enfants comme aux adultes. On vient chez vous à
            Toulouse et partout en Haute-Garonne. Vous n'avez rien à préparer.
          </Reveal>

          <Reveal load delay={500} className="order-3 mt-6 flex flex-col gap-3 sm:flex-row md:order-4 md:mt-9">
            <Button asChild variant="cta" size="lg" className="pc-shine relative overflow-hidden">
              <Link to="/contact" search={{}}>
                Prendre rendez-vous
                <ArrowRight data-arrow />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={site.phoneHref}>
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-accent">
                  <Phone className="size-4 text-primary" />
                </span>
                {site.phoneDisplay}
              </a>
            </Button>
          </Reveal>

          <Reveal
            load
            as="ul"
            delay={580}
            className="no-scrollbar order-5 -mx-5 mt-7 flex gap-2.5 overflow-x-auto px-5 md:mx-0 md:mt-10 md:flex-wrap md:overflow-visible md:px-0"
          >
            {[
              { icon: Home, label: "Intervention à domicile", tone: "bg-accent text-primary" },
              { icon: Leaf, label: "Produits 100 % naturels", tone: "bg-mint-soft text-mint-ink" },
              { icon: CalendarClock, label: "Disponible 7j/7", tone: "bg-accent text-primary" },
            ].map(({ icon: Icon, label, tone }) => (
              <li
                key={label}
                className="flex shrink-0 items-center gap-2 rounded-full bg-white/80 py-1.5 pr-4 pl-1.5 text-sm font-semibold whitespace-nowrap text-navy shadow-soft ring-1 ring-border/60 backdrop-blur"
              >
                <span className={cn("inline-flex size-7 items-center justify-center rounded-full", tone)}>
                  <Icon className="size-3.5" />
                </span>
                {label}
              </li>
            ))}
          </Reveal>
        </div>
      </div>

      {/* Scroll cue (desktop) */}
      <div aria-hidden="true" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-navy/20 pt-2">
          <span className="pc-scroll-dot block size-1.5 rounded-full bg-navy/50" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================ Trust bar */

function TrustBar() {
  const tile =
    "group/spot relative isolate flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-[1.75rem] p-5 transition-transform duration-500 ease-out hover:-translate-y-1 md:min-h-48 md:p-7";

  return (
    <section aria-label="Chiffres clés" className="relative py-10 md:py-14">
      <div className="section-x grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <Reveal>
          <div onPointerMove={spotlight} className={cn(tile, "bg-navy text-white shadow-card")}>
            <Spot color="rgb(87 174 140 / 0.25)" />
            <HairStrand className="absolute right-0 bottom-6 left-0 -z-[1] h-6 text-white/10" waves={4} amplitude={8} strokeWidth={1.5} />
            <Users className="size-5 text-mint" aria-hidden="true" />
            <div>
              <p className="font-display text-[clamp(2rem,7vw,3.4rem)] leading-none font-bold tracking-tight">
                <CountUp value={2000} prefix="+" grouping={false} />
              </p>
              <p className="mt-2 text-sm font-semibold text-white/70">familles accompagnées</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div onPointerMove={spotlight} className={cn(tile, "bg-white shadow-soft ring-1 ring-border/60")}>
            <Spot />
            <StarRating />
            <div>
              <p className="font-display text-[clamp(2rem,7vw,3.4rem)] leading-none font-bold tracking-tight text-primary">
                <CountUp value={4.9} decimals={1} suffix="/5" />
              </p>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">Note moyenne</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div onPointerMove={spotlight} className={cn(tile, "bg-mint-soft ring-1 ring-mint/20")}>
            <Spot color="rgb(87 174 140 / 0.22)" />
            <IconBadge icon={BadgeCheck} tone="mint" />
            <p className="font-display text-lg leading-snug font-semibold text-navy md:text-xl">Méthode certifiée</p>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <div onPointerMove={spotlight} className={cn(tile, "bg-accent ring-1 ring-primary/10")}>
            <Spot />
            <IconBadge icon={HeartHandshake} tone="blue" />
            <p className="font-display text-lg leading-snug font-semibold text-navy md:text-xl">
              Intervenants formés et assurés
            </p>
          </div>
        </Reveal>
      </div>

      {/* Towns — two opposite marquees */}
      <div className="mt-10 md:mt-14">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-mint-ink uppercase">Zone d'intervention</p>
        <ul className="sr-only">
          {villes.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
        <div
          aria-hidden="true"
          className="group/mq mt-5 space-y-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"
        >
          {[villes, [...villes].reverse()].map((row, r) => (
            <div
              key={r}
              className={cn(
                "flex w-max group-hover/mq:[animation-play-state:paused]",
                r === 0 ? "pc-marquee-x" : "pc-marquee-x-rev",
              )}
            >
              {[...row, ...row].map((v, i) => (
                <span
                  key={`${v}-${i}`}
                  className={cn(
                    "mr-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap",
                    r === 0
                      ? "bg-white text-navy/80 shadow-soft ring-1 ring-border/60"
                      : "bg-transparent text-navy/60 ring-1 ring-navy/10",
                  )}
                >
                  <MapPin className={cn("size-3.5", r === 0 ? "text-mint-ink" : "text-primary/60")} />
                  {v}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================== Atouts */

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
      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(14rem,auto))]">
        {/* Big tile */}
        <Reveal className="md:col-span-2 lg:row-span-2">
          <div
            onPointerMove={spotlight}
            className="group/spot relative isolate flex h-full min-h-[22rem] flex-col items-start overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-[#1d47a0] to-navy p-7 text-white shadow-card md:p-10"
          >
            <Spot color="rgb(255 255 255 / 0.10)" />
            <div aria-hidden="true" className="absolute inset-0 -z-[2]">
              <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-mint/30 blur-3xl" />
              <HairStrand className="absolute top-[58%] left-0 h-8 w-full text-white/15" waves={5} amplitude={10} strokeWidth={1.5} />
            </div>

            {/* Animated clock */}
            <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute top-6 right-6 size-24 text-white md:top-10 md:right-10 md:size-36">
              <circle cx="50" cy="50" r="45" fill="white" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
              {Array.from({ length: 12 }, (_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="9"
                  x2="50"
                  y2={i % 3 === 0 ? 17 : 13}
                  stroke="currentColor"
                  strokeOpacity={i % 3 === 0 ? 0.7 : 0.3}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  transform={`rotate(${i * 30} 50 50)`}
                />
              ))}
              <line x1="50" y1="50" x2="50" y2="30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="pc-clock-hand" style={{ transformOrigin: "50px 50px", animationDuration: "48s" }} />
              <line x1="50" y1="50" x2="50" y2="20" stroke="#57AE8C" strokeWidth="3" strokeLinecap="round" className="pc-clock-hand" style={{ transformOrigin: "50px 50px" }} />
              <circle cx="50" cy="50" r="4" fill="currentColor" />
            </svg>

            <span aria-hidden="true" className="font-display text-sm font-bold tracking-widest text-white/50">01</span>
            <IconBadge icon={rapidite.icon} tone="white" size="lg" className="mt-6" />
            <h3 className="mt-8 text-display-lg text-white lg:mt-auto">{rapidite.titre}</h3>
            <p className="mt-4 max-w-sm text-lg text-white/80 md:text-xl">{rapidite.texte}</p>
            <Pill tone="dark" live className="mt-8">
              Disponible aujourd'hui
            </Pill>
          </div>
        </Reveal>

        {/* Sécurité — wide mint tile */}
        <Reveal delay={100} className="md:col-span-2">
          <div
            onPointerMove={spotlight}
            className="group/spot relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint-soft to-white p-7 ring-1 ring-mint/25 transition-transform duration-500 hover:-translate-y-1 sm:flex-row sm:items-center md:p-8"
          >
            <Spot color="rgb(87 174 140 / 0.20)" />
            <Leaf aria-hidden="true" strokeWidth={1} className="absolute -right-8 -bottom-10 -z-[1] size-56 text-mint/15 transition-transform duration-700 group-hover/spot:rotate-12" />
            <span aria-hidden="true" className="absolute top-6 right-7 font-display text-sm font-bold tracking-widest text-mint-ink/50">02</span>
            <IconBadge icon={securite.icon} tone="mint" size="lg" />
            <div>
              <h3 className="text-display-md text-navy">{securite.titre}</h3>
              <p className="mt-2 max-w-md text-muted-foreground">{securite.texte}</p>
            </div>
          </div>
        </Reveal>

        {[discretion, expertise].map((a, i) => (
          <Reveal key={a.titre} delay={200 + i * 100}>
            <div
              onPointerMove={spotlight}
              className="group/spot relative isolate flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-7 shadow-soft ring-1 ring-border/60 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-card"
            >
              <Spot />
              <span aria-hidden="true" className="absolute top-6 right-7 font-display text-sm font-bold tracking-widest text-navy/25">
                0{i + 3}
              </span>
              <div className="transition-transform duration-500 group-hover/spot:-rotate-6 group-hover/spot:scale-110">
                <IconBadge icon={a.icon} tone="blue" />
              </div>
              <h3 className="mt-6 text-xl text-navy md:text-2xl">{a.titre}</h3>
              <p className="mt-2 text-muted-foreground">{a.texte}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================== Étapes */

function Etapes() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const next = () => setActive((a) => (a + 1) % etapes.length);

  return (
    <Section id="comment-ca-marche" tone="tint">
      <SectionHeading title={<>Comment ça <Highlight>marche</Highlight></>} />

      <div
        className="mt-12 grid items-center gap-8 md:mt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-14"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
      >
        {/* Stage */}
        <Reveal className="relative lg:order-2">
          <div className="relative mx-auto max-w-lg rounded-[2.5rem] bg-gradient-to-br from-mint/40 via-white to-primary/25 p-1.5 shadow-card md:p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-mint-soft to-accent lg:aspect-[4/5]">
              {images.etapes.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  loading="lazy"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out",
                    i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="glass absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2 shadow-card lg:bottom-8 lg:-left-6 lg:translate-x-0">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-white">
              {active + 1}
            </span>
            <span className="text-sm font-bold text-navy">Étape {active + 1}/4</span>
          </div>
          <HairStrand className="absolute -top-6 right-6 hidden h-10 w-40 text-primary/25 lg:block" waves={3} amplitude={8} strokeWidth={2} />
        </Reveal>

        {/* Steps list */}
        <ol className="flex flex-col gap-3 lg:order-1">
          {etapes.map((e, i) => {
            const isActive = i === active;
            return (
              <Reveal as="li" key={e.titre} delay={i * 100}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "relative flex w-full cursor-pointer items-start gap-4 overflow-hidden rounded-[1.5rem] p-4 text-left transition-[background-color,box-shadow] duration-500 focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:outline-none md:gap-5 md:p-5",
                    isActive ? "bg-white shadow-card ring-1 ring-border/60" : "hover:bg-white/60",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold transition-colors duration-500",
                      isActive ? "bg-navy text-white" : "bg-white text-navy/50 ring-1 ring-border",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 pt-2.5">
                    <span className={cn("block font-display text-lg font-semibold transition-colors md:text-xl", isActive ? "text-navy" : "text-navy/60")}>
                      {e.titre}
                    </span>
                    <span
                      className={cn(
                        "grid transition-[grid-template-rows] duration-500 ease-out",
                        isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-1.5 text-muted-foreground">{e.texte}</span>
                      </span>
                    </span>
                  </span>
                  {isActive && (
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-primary/10">
                      <span
                        key={active}
                        onAnimationEnd={next}
                        className="pc-progress block h-full bg-gradient-to-r from-primary to-mint"
                        style={{ animationPlayState: paused ? "paused" : "running" }}
                      />
                    </span>
                  )}
                </button>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <Reveal className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Pill tone="mint" icon={BadgeCheck} className="px-5 py-2.5 text-base">
          Un seul rendez-vous suffit dans la majorité des cas.
        </Pill>
        <Link
          to="/comment-ca-marche"
          className="group inline-flex items-center gap-1.5 font-bold text-primary underline-offset-4 hover:underline"
        >
          Voir la méthode en détail
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </Section>
  );
}

/* ============================================================ Services */

function Services() {
  const [active, setActive] = useState(0);

  return (
    <Section>
      <SectionHeading title={<>Nos <Highlight>services</Highlight></>} />

      {/* Desktop — expanding panels */}
      <Reveal className="mt-16 hidden h-[32rem] gap-4 md:flex lg:h-[36rem]">
        {apercuServices.map((s, i) => {
          const open = i === active;
          return (
            <Link
              key={s.slug}
              to="/services"
              hash={s.slug}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={cn(
                "group relative isolate flex min-w-0 flex-col justify-end overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint-soft to-accent shadow-card transition-[flex] duration-700 ease-[cubic-bezier(.22,1,.36,1)] focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none",
                open ? "flex-[2.3]" : "flex-1",
              )}
            >
              <img
                src={s.img}
                alt={s.titre}
                loading="lazy"
                width={928}
                height={720}
                className={cn(
                  "absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1200ms] ease-out",
                  open ? "scale-105" : "scale-100",
                )}
              />
              <div
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 -z-10 bg-gradient-to-t transition-opacity duration-500",
                  open ? "from-navy via-navy/50 to-transparent" : "from-navy/95 via-navy/70 to-navy/20",
                )}
              />
              <span className="glass absolute top-5 left-5 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-bold text-navy shadow-soft">
                {s.prix}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-5 right-5 inline-flex size-11 items-center justify-center rounded-full shadow-soft transition-all duration-500",
                  open ? "rotate-45 bg-destructive text-white" : "bg-white/90 text-navy",
                )}
              >
                <ArrowUpRight className="size-5" />
              </span>

              <div className="p-7 text-white">
                <IconBadge icon={s.icon} tone="white" size="sm" />
                <h3 className={cn("mt-4 text-white transition-all duration-500", open ? "text-3xl" : "text-xl")}>{s.titre}</h3>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-sm pt-3 text-lg text-white/80">{s.texte}</p>
                    <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-navy">
                      Découvrir <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </Reveal>

      {/* Mobile — snap carousel */}
      <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 md:hidden">
        {apercuServices.map((s) => (
          <Link
            key={s.slug}
            to="/services"
            hash={s.slug}
            className="relative isolate flex aspect-[3/4] w-[82%] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[2rem] bg-gradient-to-br from-mint-soft to-accent shadow-card min-[480px]:w-[60%]"
          >
            <img src={s.img} alt={s.titre} loading="lazy" width={928} height={720} className="absolute inset-0 -z-20 h-full w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/55 to-transparent to-75%" />
            <span className="glass absolute top-4 left-4 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-bold text-navy shadow-soft">
              {s.prix}
            </span>
            <div className="p-6 text-white">
              <IconBadge icon={s.icon} tone="white" size="sm" />
              <h3 className="mt-4 text-2xl text-white">{s.titre}</h3>
              <p className="pt-2 text-white/80">{s.texte}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-mint">
                Découvrir <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================== Tarifs */

function HairLength({ level }: { level: number }) {
  const hair = "#6B4A36";
  const hairDark = "#55392A";
  const fade = (on: boolean) =>
    cn("transition-opacity duration-500 ease-out", on ? "opacity-100" : "opacity-0");

  return (
    <svg aria-hidden="true" viewBox="0 0 160 180" className="h-40 w-auto md:h-48">
      {/* ground shadow */}
      <ellipse cx="80" cy="176" rx="52" ry="5" fill="#17203A" opacity=".08" />

      {/* shoulders + t-shirt */}
      <path d="M28 180c0-30 20-46 52-46s52 16 52 46z" fill="#1F4FB0" />
      <path d="M64 135q16 14 32 0" fill="none" stroke="#E0262A" strokeWidth="5" strokeLinecap="round" />

      {/* BACK HAIR — one shape per level */}
      {/* 1 · mi-longs (to shoulders) */}
      <path
        className={fade(level === 1)}
        d="M48 78c-3 24-2 44 6 58 6 4 14 5 18 2V112H88v26c4 3 12 2 18-2 8-14 9-34 6-58z"
        fill={hair}
      />
      {/* 2 · longs (past shoulders) — also used for forte infestation */}
      <path
        className={fade(level === 2 || level === 4)}
        d="M47 78c-6 34-5 66 2 88 8 4 18 4 23 0V112H88v54c5 4 15 4 23 0 7-22 8-54 2-88z"
        fill={hair}
      />
      {/* 3 · extra-longs (thick / curly) */}
      <g className={fade(level === 3)}>
        <path
          d="M46 74c-12 10-8 22-12 32-6 12 2 20-3 32-5 12 3 24 0 34h41V112H88v60h41c-3-10 5-22 0-34-5-12 3-20-3-32-4-10 0-22-12-32z"
          fill={hair}
        />
        {[
          [38, 104],
          [34, 128],
          [36, 152],
          [122, 104],
          [126, 128],
          [124, 152],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill={hair} />
        ))}
        <path
          d="M40 120q6-4 4-10M120 120q-6-4-4-10M42 146q6-4 3-10M118 146q-6-4-3-10"
          stroke={hairDark}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* neck */}
      <rect x="71" y="106" width="18" height="32" rx="8" fill="#EDB896" />

      {/* ears */}
      <circle cx="50" cy="88" r="6.5" fill="#F2BC98" />
      <circle cx="110" cy="88" r="6.5" fill="#F2BC98" />

      {/* head */}
      <ellipse cx="80" cy="84" rx="30" ry="32" fill="#F6C9A8" />

      {/* face */}
      <circle cx="69" cy="88" r="3.2" fill="#17203A" />
      <circle cx="91" cy="88" r="3.2" fill="#17203A" />
      <circle cx="70.2" cy="86.8" r="1" fill="#fff" />
      <circle cx="92.2" cy="86.8" r="1" fill="#fff" />
      <circle cx="63" cy="97" r="4.5" fill="#F29A9A" opacity=".5" />
      <circle cx="97" cy="97" r="4.5" fill="#F29A9A" opacity=".5" />
      <path d="M73 100q7 6 14 0" stroke="#17203A" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* TOP HAIR — cap + fringe (all levels) */}
      <path
        d="M49 86c-3-24 10-40 31-40s34 16 31 40c-3-8-8-14-15-18-4 6-14 10-26 10-8 0-14 2-18 6z"
        fill={hair}
      />
      <path
        d="M62 60q8-6 18-6M84 56q10 2 16 10"
        stroke={hairDark}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity=".6"
      />
      {/* short-hair sideburns (level 0) */}
      <g className={fade(level === 0)}>
        <path d="M49 86c0-6 2-10 5-12l2 12z" fill={hair} />
        <path d="M111 86c0-6-2-10-5-12l-2 12z" fill={hair} />
      </g>

      {/* 4 · forte infestation — little lice + nits */}
      <g className={fade(level === 4)}>
        {[
          [56, 64, -20],
          [100, 60, 25],
          [54, 132, 10],
          [106, 148, -15],
        ].map(([x, y, r]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${r})`}>
            <path
              d="M-4-2l-3-2M-4 1l-3 1M4-2l3-2M4 1l3 1"
              stroke="#17203A"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <ellipse rx="3.6" ry="4.6" fill="#E0262A" />
            <circle cy="-4.6" r="2" fill="#B81E22" />
          </g>
        ))}
        {[
          [62, 120],
          [98, 124],
          [58, 150],
          [102, 136],
          [66, 70],
          [94, 72],
        ].map(([x, y]) => (
          <ellipse key={`n-${x}-${y}`} cx={x} cy={y} rx="1.4" ry="2" fill="#FFF8F1" />
        ))}
      </g>
    </svg>
  );
}

function Tarifs() {
  const [sel, setSel] = useState(0);
  const [people, setPeople] = useState(1);
  const row = tarifRows[sel] ?? tarifRows[0];
  const discount = FAMILY_DISCOUNT_PER_ADDITIONAL_PERSON;

  const total = row ? row.montant + (people - 1) * Math.max(row.montant - discount, 0) : 0;

  return (
    <Section id="tarifs" tone="navy" className="overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
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
          <Reveal delay={200} className="mt-4 flex items-start gap-3 rounded-2xl bg-mint/10 p-4 text-sm text-white/85 ring-1 ring-mint/25">
            <Users className="mt-0.5 size-4 shrink-0 text-mint" />
            À partir de la 2ᵉ personne : {discount} € de réduction par personne.
          </Reveal>
          <Reveal delay={250} className="mt-8">
            <Button asChild variant="cta" size="lg" className="pc-shine relative w-full overflow-hidden sm:w-auto">
              <Link to="/contact" search={{}}>
                Prendre rendez-vous
                <ArrowRight data-arrow />
              </Link>
            </Button>
          </Reveal>
        </div>

        {row && (
          <Reveal delay={100} className="min-w-0">
            <div className="relative isolate overflow-hidden rounded-[2rem] bg-white/[0.05] p-5 ring-1 ring-white/10 backdrop-blur md:p-8">
              <div aria-hidden="true" className="absolute -top-24 -right-24 -z-10 size-72 rounded-full bg-primary/40 blur-3xl" />

              {/* Hair length selector */}
              <div role="tablist" aria-label="Longueur des cheveux" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
                {tarifRows.map((t, i) => (
                  <button
                    key={t.type}
                    type="button"
                    role="tab"
                    aria-selected={i === sel}
                    onClick={() => setSel(i)}
                    className={cn(
                      "min-h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-bold whitespace-nowrap transition-colors duration-300",
                      i === sel ? "bg-white text-navy shadow-soft" : "bg-white/[0.06] text-white/70 ring-1 ring-white/10 hover:bg-white/10",
                    )}
                  >
                    {t.type}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)] md:gap-8">
                <div className="mx-auto flex size-44 shrink-0 items-center justify-center rounded-[2rem] bg-gradient-to-br from-mint-soft to-accent md:size-52">
                  <HairLength level={sel} />
                </div>
                <div className="min-w-0 text-center sm:text-left">
                  <p className="text-sm font-bold tracking-widest break-words text-mint uppercase">{row.type}</p>
                  <p key={sel} className="pc-word mt-2 text-white">
                    {row.aPartir && (
                      <span className="mb-1 block text-base font-semibold text-white/70 md:text-lg">
                        à partir de
                      </span>
                    )}
                    <span className="block font-display text-[clamp(2.4rem,5vw,3.75rem)] leading-none font-bold tracking-tight whitespace-nowrap">
                      {row.montant} €
                    </span>
                  </p>
                  <p className="mt-3 text-white/70">{row.detail}</p>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3 py-1.5 text-sm font-semibold text-white/85">
                    <Clock className="size-4 text-mint" /> {row.duree}
                  </p>
                </div>
              </div>

              {/* Family estimate */}
              <div className="mt-8 flex flex-col gap-5 rounded-[1.5rem] bg-white p-5 text-navy sm:flex-row sm:items-center sm:justify-between md:p-6">
                <div>
                  <p className="text-sm font-bold text-muted-foreground">Nombre de personnes</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Retirer une personne"
                      onClick={() => setPeople((p) => Math.max(1, p - 1))}
                      disabled={people <= 1}
                      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-accent text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span aria-live="polite" className="w-8 text-center font-display text-2xl font-bold">
                      {people}
                    </span>
                    <button
                      type="button"
                      aria-label="Ajouter une personne"
                      onClick={() => setPeople((p) => Math.min(10, p + 1))}
                      disabled={people >= 10}
                      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-accent text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm font-bold text-muted-foreground">Total estimé{row.aPartir ? " (à partir de)" : ""}</p>
                  <p key={`${sel}-${people}`} className="pc-word font-display text-4xl font-bold tracking-tight text-primary">
                    {total} €
                  </p>
                  <p className="text-xs text-muted-foreground">hors frais de déplacement</p>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

/* ========================================================= Témoignages */

function AvisCard({ a, i, hidden, className }: { a: Avis; i: number; hidden?: boolean; className?: string }) {
  return (
    <figure
      aria-hidden={hidden || undefined}
      className={cn("relative rounded-[1.75rem] bg-white p-6 shadow-soft ring-1 ring-border/60", className)}
    >
      <Quote aria-hidden="true" className="absolute top-5 right-5 size-8 text-primary/10" />
      <StarRating />
      <blockquote className="mt-4 leading-relaxed text-navy">« {a.texte} »</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <Initial nom={a.nom} i={i} className="size-10 text-sm" />
        <span>
          <span className="block font-bold text-navy">{a.nom}</span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {a.ville}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

function Temoignages() {
  const colB = [...avis].reverse();

  return (
    <Section tone="cream" className="overflow-hidden">
      <SectionHeading title={<>Ils nous ont <Highlight>appelés</Highlight></>} />
      <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8">
        {/* Summary */}
        <Reveal className="lg:self-center">
          <div className="relative isolate flex flex-col justify-between overflow-hidden rounded-[2rem] bg-navy p-7 text-white shadow-card md:p-8">
            <div aria-hidden="true" className="absolute -right-16 -bottom-16 -z-10 size-56 rounded-full bg-mint/25 blur-3xl" />
            <div className="flex items-center">
              {avis.map((a, i) => (
                <Initial key={a.nom} nom={a.nom} i={i} className="-ml-2.5 size-11 ring-[3px] ring-navy first:ml-0" />
              ))}
            </div>
            <p className="mt-6 font-display text-6xl leading-none font-bold tracking-tight md:text-7xl">
              <CountUp value={4.9} decimals={1} suffix="/5" />
            </p>
            <StarRating size="md" className="mt-4" />
            <p className="mt-3 text-white/70">Note moyenne</p>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="font-display text-3xl font-bold">
                <CountUp value={2000} prefix="+" grouping={false} />
              </p>
              <p className="text-white/70">familles accompagnées</p>
            </div>
          </div>
        </Reveal>

        {/* Desktop — vertical testimonial wall */}
        <Reveal
          delay={120}
          className="group/wall relative hidden h-[36rem] grid-cols-2 gap-5 overflow-hidden [mask-image:linear-gradient(transparent,black_12%,black_88%,transparent)] lg:grid"
        >
          {[avis, colB].map((col, c) => (
            <div
              key={c}
              className={cn(
                "flex flex-col group-hover/wall:[animation-play-state:paused]",
                c === 0 ? "pc-marquee-y" : "pc-marquee-y-rev",
              )}
            >
              {[...col, ...col].map((a, i) => (
                <AvisCard key={`${a.nom}-${i}`} a={a} i={avis.indexOf(a)} hidden={c === 1 || i >= col.length} className="mb-5" />
              ))}
            </div>
          ))}
        </Reveal>

        {/* Mobile / tablet — swipe */}
        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 overflow-x-auto px-5 pb-4 lg:hidden">
          {avis.map((a, i) => (
            <AvisCard key={a.nom} a={a} i={i} className="mr-4 w-[85%] shrink-0 snap-start min-[540px]:w-[60%]" />
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================= FAQ */

function Faq() {
  return (
    <Section id="faq">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading align="left" title={<>Vos questions, nos <Highlight>réponses</Highlight></>} />
          <Reveal delay={100} className="mt-8">
            <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-navy p-6 text-white shadow-card md:p-7">
              <div aria-hidden="true" className="absolute -top-16 -right-16 -z-10 size-48 rounded-full bg-mint/25 blur-3xl" />
              <MessageCircle className="size-6 text-mint" aria-hidden="true" />
              <p className="mt-4 font-display text-xl font-semibold">Une autre question ?</p>
              <p className="mt-2 text-white/70">
                <Link to="/contact" search={{}} className="font-bold text-white underline underline-offset-4 hover:text-mint">
                  Écrivez-nous
                </Link>{" "}
                ou lisez nos{" "}
                <Link to="/blog" className="font-bold text-white underline underline-offset-4 hover:text-mint">
                  articles
                </Link>
                .
              </p>
              <Button asChild variant="cta" className="mt-6 w-full sm:w-auto">
                <a href={site.phoneHref}>
                  <Phone className="size-4" /> {site.phoneDisplay}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <AccordionPrimitive.Root type="single" collapsible className="flex flex-col gap-3">
            {faq.map((item, i) => (
              <AccordionPrimitive.Item
                key={item.q}
                value={item.q}
                className="rounded-[1.5rem] bg-secondary/50 px-5 ring-1 ring-transparent transition-[background-color,box-shadow] duration-300 data-[state=open]:bg-white data-[state=open]:shadow-card data-[state=open]:ring-border/60 md:px-6"
              >
                <AccordionPrimitive.Header>
                  <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center gap-4 py-5 text-left font-display text-lg font-semibold text-navy transition-colors hover:text-primary md:py-6 md:text-xl">
                    <span aria-hidden="true" className="w-7 shrink-0 font-display text-sm font-bold text-primary/40 transition-colors group-data-[state=open]:text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1">{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-soft transition-[transform,background-color,color] duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-primary group-data-[state=open]:text-white"
                    >
                      <Plus className="size-5" />
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="max-w-2xl pb-6 pl-11 leading-relaxed text-muted-foreground md:pr-12">{item.r}</p>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </Reveal>
      </div>
    </Section>
  );
}