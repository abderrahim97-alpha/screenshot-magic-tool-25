import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BookOpen, Clock, Search, Sparkles, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

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

/* ============================================================= Helpers */

function spotlight(e: ReactPointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Spot({ color = "rgb(31 79 176 / 0.08)" }: { color?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-[1] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
      style={{
        background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 45%)`,
      }}
    />
  );
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/* ================================================================ Page */

function BlogPage() {
  const [cat, setCat] = useState("Tous");
  const [query, setQuery] = useState("");

  const q = normalize(query.trim());
  const list = articles
    .filter((a) => cat === "Tous" || a.categorie === cat)
    .filter((a) => !q || normalize(`${a.titre} ${a.extrait} ${a.categorie}`).includes(q));

  const [featured, second, third, ...rest] = list;
  const sideCards = [second, third].filter((a): a is Article => !!a);
  const key = `${cat}-${q}`;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Blog" }]}
        highlight="sereins"
        eyebrow="Conseils"
        titre="Le blog des parents sereins"
        intro="Des réponses claires, sans jugement, pour comprendre et agir calmement."
      />

      <section className="relative isolate pb-8">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="pc-aurora absolute top-40 -left-40 size-[30rem] rounded-full bg-accent/60 blur-3xl" />
          <div className="pc-aurora absolute top-[40%] right-[-12rem] size-[28rem] rounded-full bg-mint-soft/70 blur-3xl [animation-delay:-9s]" />
        </div>

        <div className="section-x">
          {/* Toolbar: search + categories */}
          <div className="relative z-10 -mt-6 flex flex-col gap-3 md:-mt-10 lg:flex-row lg:items-center lg:justify-between">
            <CategoryPills value={cat} onChange={setCat} />
            <SearchBox value={query} onChange={setQuery} />
          </div>

          <p className="mt-6 text-sm font-semibold text-muted-foreground" aria-live="polite">
            <BookOpen className="mr-1.5 inline size-4 align-[-3px] text-primary" aria-hidden="true" />
            {list.length} {list.length > 1 ? "articles" : "article"}
          </p>

          {list.length === 0 && (
            <Reveal className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-soft ring-1 ring-border/60">
              <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-accent text-primary">
                <Search className="size-6" />
              </span>
              <p className="mt-4 font-display text-xl font-semibold text-navy">Aucun article trouvé</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCat("Tous");
                }}
                className="mt-5 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-navy px-5 text-sm font-bold text-white"
              >
                Voir tous les articles
              </button>
            </Reveal>
          )}

          {/* Bento: featured + 2 side cards */}
          {featured && (
            <div className="mt-4 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <FeaturedCard key={`f-${key}-${featured.slug}`} article={featured} />
              {sideCards.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                  {sideCards.map((a, i) => (
                    <CompactCard key={`s-${key}-${a.slug}`} article={a} delay={120 + i * 100} />
                  ))}
                </div>
              )}
            </div>
          )}

          {rest.length > 0 && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((a, i) => (
                <Reveal key={`r-${key}-${a.slug}`} delay={i * 90}>
                  <ArticleCard article={a} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CtaBanner className="pt-16 md:pt-24" />
    </>
  );
}

/* ========================================================== Categories */

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

  const count = (c: string) => (c === "Tous" ? articles.length : articles.filter((a) => a.categorie === c).length);

  return (
    <div className="no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <div
        ref={listRef}
        role="toolbar"
        aria-label="Catégories"
        className="relative inline-flex gap-1 rounded-full border border-white/70 bg-white/90 p-1.5 shadow-card backdrop-blur-xl"
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1.5 bottom-1.5 rounded-full bg-navy shadow-soft transition-[left,width,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
            indicator ? "opacity-100" : "opacity-0",
          )}
          style={indicator ? { left: indicator.left, width: indicator.width } : undefined}
        />
        {categories.map((c) => {
          const active = value === c;
          return (
            <button
              key={c}
              type="button"
              data-cat={c}
              aria-pressed={active}
              onClick={() => onChange(c)}
              className={cn(
                "relative z-10 inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-bold whitespace-nowrap transition-colors duration-300 md:px-5",
                active ? cn("text-white", !indicator && "bg-navy") : "text-navy/70 hover:text-navy",
              )}
            >
              {c}
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[0.7rem] leading-5 transition-colors",
                  active ? "bg-white/15 text-white" : "bg-accent text-primary",
                )}
              >
                {count(c)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="group relative flex h-14 w-full items-center rounded-full border border-white/70 bg-white/90 shadow-card backdrop-blur-xl transition-shadow focus-within:ring-4 focus-within:ring-primary/15 lg:w-80">
      <span className="sr-only">Rechercher un article</span>
      <Search className="pointer-events-none absolute left-5 size-5 text-primary" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un article"
        className="h-full w-full rounded-full bg-transparent pr-12 pl-12 text-base text-navy outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Effacer la recherche"
          className="absolute right-3 inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-accent text-primary transition-colors hover:bg-primary hover:text-white"
        >
          <X className="size-4" />
        </button>
      )}
    </label>
  );
}

/* =============================================================== Cards */

function FeaturedCard({ article: a }: { article: Article }) {
  return (
    <Reveal className="h-full">
      <Link
        to="/blog/$slug"
        params={{ slug: a.slug }}
        onPointerMove={spotlight}
        className="group/spot relative isolate flex h-full min-h-[26rem] flex-col justify-end overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-mint-soft to-accent shadow-card focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none md:min-h-[32rem]"
      >
        <img
          src={a.image}
          alt={a.titre}
          width={1586}
          height={992}
          className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover/spot:scale-105"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy via-navy/60 to-transparent to-80%" />

        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-navy shadow-soft">
            <Sparkles className="size-3.5 text-star" aria-hidden="true" /> À la une
          </span>
          <span className="glass inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold text-mint-ink shadow-soft">
            {a.categorie}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="absolute top-5 right-5 inline-flex size-12 items-center justify-center rounded-full bg-white/90 text-navy shadow-soft transition-all duration-500 group-hover/spot:rotate-45 group-hover/spot:bg-destructive group-hover/spot:text-white"
        >
          <ArrowUpRight className="size-5" />
        </span>

        <div className="p-6 text-white md:p-10">
          <h2 className="max-w-2xl text-display-md text-white md:text-display-lg">{a.titre}</h2>
          <p className="mt-4 line-clamp-2 max-w-xl text-lg text-white/80">{a.extrait}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/90 ring-1 ring-white/15">
              <Clock className="size-4" /> {a.lecture} de lecture
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
              Lire l'article
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/spot:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

function CompactCard({ article: a, delay }: { article: Article; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        to="/blog/$slug"
        params={{ slug: a.slug }}
        onPointerMove={spotlight}
        className="group/spot relative isolate flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-border/60 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-card focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none lg:flex-row"
      >
        <Spot />
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-gradient-to-br from-mint-soft to-accent lg:aspect-auto lg:w-[42%]">
          <img
            src={a.image}
            alt={a.titre}
            width={1586}
            height={992}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/spot:scale-110"
          />
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <Pill tone="mint" className="self-start text-xs">
            {a.categorie}
          </Pill>
          <h2 className="mt-3 font-display text-lg leading-snug font-semibold text-navy transition-colors group-hover/spot:text-primary md:text-xl">
            {a.titre}
          </h2>
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4" /> {a.lecture}
            </span>
            <span
              aria-hidden="true"
              className="inline-flex size-9 items-center justify-center rounded-full bg-accent text-primary transition-all duration-500 group-hover/spot:rotate-45 group-hover/spot:bg-primary group-hover/spot:text-white"
            >
              <ArrowUpRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}