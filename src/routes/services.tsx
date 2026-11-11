import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, Users } from "lucide-react";

import serviceDomicile from "@/assets/service-domicile.jpg";
import serviceCollectivite from "@/assets/service-collectivite.jpg";
import serviceDepistage from "@/assets/service-depistage.jpg";
import { Breadcrumb, CtaBanner, PageHeader } from "@/components/site/Bits";
import { Button } from "@/components/ui/button";
import { services, tarifs } from "@/lib/site";
import { travelZones } from "@/lib/travel-fees";

const images: Record<string, string> = {
  "traitement-domicile": serviceDomicile,
  "diagnostic-depistage": serviceDepistage,
  collectivite: serviceCollectivite,
};

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

function ServicesPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Nos services" }]} />
      <PageHeader
        eyebrow="Nos services"
        titre="Une solution adaptée à chaque situation"
        intro="Un simple doute, toute une famille à traiter ou une école à accompagner : on vient à vous, avec des produits doux et une méthode éprouvée."
      />
      <section className="section-x space-y-16 py-16">
        {services.map((s, i) => (
          <article
            key={s.slug}
            id={s.slug}
            className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
          >
            <img
              src={images[s.slug]}
              alt={s.titre}
              loading="lazy"
              className={`aspect-[4/3] w-full rounded-3xl object-cover shadow-card ${i % 2 ? "md:order-2" : ""}`}
            />
            <div>
              <h2 className="text-2xl md:text-3xl">{s.titre}</h2>
              <p className="mt-3 text-lg text-muted-foreground">{s.resume}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-accent px-3 py-1 font-bold text-primary">
                  {s.prix}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
                  <Clock className="size-4" /> {s.duree}
                </span>
              </div>
              <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                <Users className="mt-0.5 size-4 shrink-0" /> {s.public}
              </p>
              <ul className="mt-5 space-y-2">
                {s.details.map((d) => (
                  <li key={d} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-mint" /> {d}
                  </li>
                ))}
              </ul>
              <Button asChild variant="cta" className="mt-6">
                <Link to="/contact" search={s.slug === "collectivite" ? { service: s.slug } : {}}>
                  {s.slug === "collectivite" ? "Demander un devis" : "Réserver ce service"}
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </section>
      <section className="bg-secondary/60 py-16">
        <div className="section-x">
          <h2 className="text-center text-2xl md:text-3xl">Tarifs du traitement à domicile</h2>
          <p className="mt-2 text-center text-muted-foreground">
            Prix par personne. Frais de déplacement selon la commune.
          </p>
          <div className="mt-8 overflow-hidden rounded-3xl bg-card shadow-soft">
            {tarifs.map((t) => (
              <div
                key={t.type}
                className="flex items-center justify-between gap-4 border-b border-border px-6 py-4 last:border-0"
              >
                <div>
                  <p className="font-bold">{t.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.detail} · {t.duree}
                  </p>
                </div>
                <p className="font-display text-lg font-extrabold text-primary">{t.prix}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <section className="rounded-3xl bg-mint-soft p-6 shadow-soft">
              <h3 className="text-xl">Tarif famille</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pour plusieurs personnes traitées lors de la même intervention :
              </p>
              <ul className="mt-4 space-y-2">
                <li>• 1ʳᵉ personne : tarif normal selon la longueur des cheveux</li>
                <li>
                  • À partir de la 2ᵉ personne : <strong>10 € de réduction par personne</strong>
                </li>
                <li>
                  • Offre valable pour les personnes traitées{" "}
                  <strong>le même jour et à la même adresse</strong>
                </li>
              </ul>
            </section>
            <section className="rounded-3xl bg-mint-soft p-6 shadow-soft">
              <h3 className="text-xl">Frais de déplacement</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <strong>Colomiers : offert</strong>
                </li>
                {travelZones.map((zone) => (
                  <li key={zone.label}>
                    <strong>{zone.label} :</strong> {zone.towns.join(", ")}
                  </li>
                ))}
                <li>
                  <strong>Toutes les autres communes : sur devis</strong>
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                Les frais de déplacement sont facturés une seule fois par adresse, quel que soit le
                nombre de personnes traitées.
              </p>
            </section>
          </div>
        </div>
      </section>
      <CtaBanner className="py-16" />
    </>
  );
}
