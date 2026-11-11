import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BadgeCheck,
  CalendarClock,
  Clock,
  Heart,
  HeartHandshake,
  Home,
  Leaf,
  Phone,
  Quote,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import heroImg from "@/assets/hero-famille.jpg";
import serviceDomicile from "@/assets/service-domicile.jpg";
import serviceDepistage from "@/assets/service-depistage.jpg";
import serviceCollectivite from "@/assets/service-collectivite.jpg";
import { CtaBanner } from "@/components/site/Bits";
import { Button } from "@/components/ui/button";
import { faq, site, tarifs, temoignages } from "@/lib/site";

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
    img: serviceDomicile,
    icon: Home,
    titre: "Traitement à domicile",
    texte: "Toute la famille traitée en une seule visite.",
    prix: "à partir de 49 €",
  },
  {
    img: serviceDepistage,
    icon: Search,
    titre: "Diagnostic & dépistage",
    texte: "Un doute ? On vérifie et on vous dit tout clairement.",
    prix: "19 € par personne",
  },
  {
    img: serviceCollectivite,
    icon: Users,
    titre: "Intervention en collectivité",
    texte: "Écoles, crèches et centres de loisirs.",
    prix: "sur devis",
  },
];

function Index() {
  return (
    <>
      <section className="overflow-hidden bg-gradient-to-b from-secondary/70 to-background">
        <div className="section-x grid items-center gap-12 py-14 md:grid-cols-2 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-3 py-1.5 text-sm font-bold text-mint">
              <Sparkles className="size-4" /> Disponible aujourd'hui
            </span>
            <h1 className="mt-5 text-4xl leading-tight md:text-5xl lg:text-[3.4rem]">
              Des poux ? On s'occupe de tout, aujourd'hui.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Traitement doux, sans insecticide, adapté aux enfants comme aux adultes. On vient chez
              vous à Toulouse et partout en Haute-Garonne. Vous n'avez rien à préparer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="cta" size="lg">
                <Link to="/contact" search={{}}>
                  Prendre rendez-vous
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={site.phoneHref}>
                  <Phone /> {site.phoneDisplay}
                </a>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-foreground/80">
              <li className="flex items-center gap-2">
                <Home className="size-4 text-primary" /> Intervention à domicile
              </li>
              <li className="flex items-center gap-2">
                <Leaf className="size-4 text-mint" /> Produits 100 % naturels
              </li>
              <li className="flex items-center gap-2">
                <CalendarClock className="size-4 text-primary" /> Disponible 7j/7
              </li>
            </ul>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Un parent qui peigne doucement les cheveux de son enfant à la maison"
              width={1200}
              height={1008}
              className="w-full rounded-3xl shadow-card"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/60 py-6">
        <div className="section-x grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          {[
            { icon: Heart, label: "+2000 familles accompagnées" },
            { icon: Star, label: "Note moyenne 4,9/5" },
            { icon: BadgeCheck, label: "Méthode certifiée" },
            { icon: HeartHandshake, label: "Intervenants formés et assurés" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <item.icon className="size-5 text-primary" />
              <span className="text-sm font-semibold text-foreground/80">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-x py-16 md:py-20">
        <h2 className="text-center text-3xl">Pourquoi nous choisir</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {atouts.map((a) => (
            <div
              key={a.titre}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-transform hover:-translate-y-1"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                <a.icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg">{a.titre}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="comment-ca-marche" className="bg-secondary/60 py-16 md:py-20">
        <div className="section-x">
          <h2 className="text-center text-3xl">Comment ça marche</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {etapes.map((e, i) => (
              <div key={e.titre} className="rounded-3xl bg-card p-6 shadow-soft">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg">{e.titre}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.texte}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-base font-semibold text-mint">
            Un seul rendez-vous suffit dans la majorité des cas.
          </p>
        </div>
      </section>

      <section className="section-x py-16 md:py-20">
        <h2 className="text-center text-3xl">Nos services</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {apercuServices.map((s) => (
            <Link
              key={s.titre}
              to="/services"
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-transform hover:-translate-y-1"
            >
              <img
                src={s.img}
                alt={s.titre}
                loading="lazy"
                width={928}
                height={720}
                className="h-44 w-full object-cover"
              />
              <div className="p-6">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                  <s.icon className="size-5" />
                </span>
                <h3 className="mt-3 text-lg">{s.titre}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.texte}</p>
                <p className="mt-4 text-sm font-bold text-primary group-hover:underline">
                  {s.prix} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="tarifs" className="bg-secondary/60 py-16 md:py-20">
        <div className="section-x">
          <h2 className="text-center text-3xl">Tarifs indicatifs</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Aucun frais caché : un devis clair vous est annoncé avant toute intervention.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {tarifs.map((t) => (
              <div key={t.type} className="rounded-3xl bg-card p-6 text-center shadow-soft">
                <h3 className="text-base">{t.type}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t.detail}</p>
                <p className="mt-4 text-2xl font-extrabold text-primary">{t.prix}</p>
                <p className="mt-2 text-xs text-muted-foreground">Environ {t.duree}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Frais de déplacement selon la zone, toujours communiqués à l'avance.
          </p>
        </div>
      </section>

      <section className="section-x py-16 md:py-20">
        <h2 className="text-center text-3xl">Ils nous ont appelés</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {temoignages.map((t) => (
            <figure
              key={t.prenom}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                  {t.prenom.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-bold text-primary">{t.prenom}</p>
                  <p className="text-xs text-muted-foreground">{t.ville}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-0.5 text-mint">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm text-muted-foreground">
                <Quote className="mb-1 size-4 text-primary/40" />
                {t.texte}
              </blockquote>
            </figure>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-secondary/60 py-16 md:py-20">
        <div className="section-x max-w-3xl">
          <h2 className="text-center text-3xl">Vos questions, nos réponses</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faq.map((item) => (
              <AccordionItem
                key={item.q}
                value={item.q}
                className="mb-3 rounded-2xl border border-border bg-card px-5"
              >
                <AccordionTrigger className="text-left text-base font-bold text-primary">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.r}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Une autre question ?{" "}
            <Link to="/contact" search={{}} className="font-bold text-primary hover:underline">
              Écrivez-nous
            </Link>{" "}
            ou lisez nos{" "}
            <Link to="/blog" className="font-bold text-primary hover:underline">
              articles
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBanner className="py-16" />
    </>
  );
}
