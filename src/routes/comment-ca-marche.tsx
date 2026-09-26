import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, CheckCircle2, Home, Phone, Search, ShieldCheck } from "lucide-react";

import { Breadcrumb, CtaBanner, PageHeader } from "@/components/site/Bits";

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
      <Breadcrumb items={[{ label: "Comment ça marche" }]} />
      <PageHeader
        eyebrow="Notre méthode"
        titre="Simple, rapide et sans stress"
        intro="Vous n'avez rien à préparer. On s'occupe de tout, du premier appel jusqu'à la tranquillité retrouvée."
      />
      <section className="section-x py-16">
        <ol className="relative mx-auto max-w-3xl space-y-8">
          {etapes.map((e, i) => (
            <li key={e.titre} className="flex gap-5 rounded-3xl bg-card p-6 shadow-soft">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                <e.icon className="size-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-mint">Étape {i + 1}</p>
                <h2 className="text-xl">{e.titre}</h2>
                <p className="mt-2 text-muted-foreground">{e.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="bg-secondary/60 py-16">
        <div className="section-x max-w-3xl">
          <h2 className="flex items-center gap-2 text-2xl md:text-3xl">
            <ShieldCheck className="size-8 text-mint" /> Nos engagements
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {engagements.map((e) => (
              <li key={e} className="flex gap-2 rounded-2xl bg-card p-4 shadow-soft">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint" /> {e}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBanner className="py-16" />
    </>
  );
}
