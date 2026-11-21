import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { useLayoutEffect, useEffect, useRef, useState } from "react";

import { ArticleCard } from "@/components/site/ArticleCard";
import { CtaBanner, PageHeader } from "@/components/site/Bits";
import { Pill } from "@/components/site/Kit";
import { Reveal } from "@/components/site/Reveal";
import { articles, categories, type Article } from "@/lib/blog";
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

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function BlogPage() {
  const [cat, setCat] = useState("Tous");
  const list = cat === "Tous" ? articles : articles.filter((a) => a.categorie === cat);
  const [featured, ...rest] = list;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Blog" }]}
        highlight="sereins"
        eyebrow="Conseils"
        titre="Le blog des parents sereins"
        intro="Des réponses claires, sans jugement, pour comprendre et agir calmement."
      />
      <section className="section-x pb-8">
        <CategoryPills value={cat} onChange={setCat} />

        {featured && <FeaturedCard key={`${cat}-${featured.slug}`} article={featured} />}

        {rest.length > 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <Reveal key={`${cat}-${a.slug}`} delay={i * 90}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
      <CtaBanner className="pt-16" />
    </>
  );
}

function CategoryPills({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useIsoLayoutEffect(() => {
    const measure = () => {
      const el = listRef.current?.querySelector<HTMLElement>(`[data-cat="${CSS.escape(value)}"]`);
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [value]);

  return (
    <div className="no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <div
        ref={listRef}
        role="toolbar"
        aria-label="Catégories"
        className="relative inline-flex gap-1 rounded-full border border-border/70 bg-white p-1.5 shadow-soft"
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1.5 bottom-1.5 rounded-full bg-navy transition-[left,width,opacity] duration-500 ease-out",
            indicator ? "opacity-100" : "opacity-0",
          )}
          style={indicator ? { left: indicator.left, width: indicator.width } : undefined}
        />
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            data-cat={c}
            aria-pressed={value === c}
            onClick={() => onChange(c)}
            className={cn(
              "relative z-10 h-11 shrink-0 rounded-full px-4 text-sm font-bold whitespace-nowrap transition-colors duration-300 md:px-5",
              value === c
                ? cn("text-white", !indicator && "bg-navy")
                : "text-navy/70 hover:text-navy",
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({ article: a }: { article: Article }) {
  return (
    <Reveal className="mt-8 md:mt-10">
      <Link
        to="/blog/$slug"
        params={{ slug: a.slug }}
        className="group grid overflow-hidden rounded-[2rem] border border-border/70 bg-white shadow-card transition-shadow duration-500 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none lg:grid-cols-[1.25fr_1fr]"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-mint-soft to-accent">
          <img
            src={a.image}
            alt=""
            width={1024}
            height={656}
            className="aspect-[16/10] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
          <Pill tone="mint" className="self-start text-xs">
            {a.categorie}
          </Pill>
          <h2 className="mt-5 text-display-md text-navy transition-colors group-hover:text-primary">
            {a.titre}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{a.extrait}</p>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4" /> {a.lecture} de lecture
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
              Lire l'article
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
