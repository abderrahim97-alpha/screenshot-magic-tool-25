import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useState } from "react";

import { Breadcrumb, CtaBanner, PageHeader } from "@/components/site/Bits";
import { articles, categories } from "@/lib/blog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog & conseils anti-poux — Poux Chrono 31" },
      {
        name: "description",
        content:
          "Reconnaître les poux, réagir dans les 24h, prévenir le retour : nos conseils simples et rassurants pour les parents.",
      },
      { property: "og:title", content: "Blog & conseils anti-poux — Poux Chrono 31" },
      {
        property: "og:description",
        content: "Des conseils simples et rassurants pour les parents face aux poux.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [cat, setCat] = useState("Tous");
  const list = cat === "Tous" ? articles : articles.filter((a) => a.categorie === cat);

  return (
    <>
      <Breadcrumb items={[{ label: "Blog" }]} />
      <PageHeader
        eyebrow="Conseils"
        titre="Le blog des parents sereins"
        intro="Des réponses claires, sans jugement, pour comprendre et agir calmement."
      />
      <section className="section-x py-12">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                cat === c ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <Link
              key={a.slug}
              to="/blog/$slug"
              params={{ slug: a.slug }}
              className="group overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow hover:shadow-card"
            >
              <img
                src={a.image}
                alt=""
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-mint">{a.categorie}</p>
                <h2 className="mt-2 text-lg leading-snug group-hover:text-primary">{a.titre}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{a.extrait}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> {a.lecture} de lecture
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <CtaBanner className="pb-16" />
    </>
  );
}
