import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";

import { ArticleCard } from "@/components/site/ArticleCard";
import { Breadcrumb, CtaBanner } from "@/components/site/Bits";
import { Pill, SectionHeading } from "@/components/site/Kit";
import { Reveal } from "@/components/site/Reveal";
import { HairStrand, Highlight } from "@/components/site/Strand";
import { Button } from "@/components/ui/button";
import { articles, getArticle } from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article introuvable" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.titre} — Poux Chrono 31` },
        { name: "description", content: a.extrait },
        { property: "og:title", content: a.titre },
        { property: "og:description", content: a.extrait },
        { property: "og:type", content: "article" },
      ],
    };
  },
  notFoundComponent: ArticleNotFound,
  component: ArticlePage,
});

function ArticleNotFound() {
  return (
    <div className="section-x py-28 text-center">
      <h1 className="text-display-lg text-navy">Article introuvable</h1>
      <Button asChild className="mt-8" size="lg">
        <Link to="/blog">Retour au blog</Link>
      </Button>
    </div>
  );
}

/** Thin bar at the very top of the viewport showing reading progress. */
function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = target.current;
        const bar = barRef.current;
        if (!el || !bar) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight * 0.6;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 1;
        bar.style.transform = `scaleX(${p})`;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [target]);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-primary via-mint to-mint"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const autres = articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const articleRef = useRef<HTMLElement>(null);

  return (
    <>
      <ReadingProgress target={articleRef} />

      <header className="relative isolate overflow-hidden pt-6 pb-10 md:pt-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-32 size-[32rem] rounded-full bg-accent blur-3xl" />
          <div className="absolute -top-20 right-[-10rem] size-[28rem] rounded-full bg-mint-soft blur-3xl" />
        </div>
        <div className="section-x">
          <Breadcrumb items={[{ label: "Blog", to: "/blog" }, { label: a.titre }]} />
          <Reveal load className="mx-auto mt-10 max-w-3xl text-center md:mt-14">
            <Pill tone="mint" className="text-xs">
              {a.categorie}
            </Pill>
            <h1 className="mt-5 text-display-lg text-navy">{a.titre}</h1>
            <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-4" /> {a.lecture} de lecture
            </p>
          </Reveal>
          <Reveal load delay={120} className="mx-auto mt-10 max-w-5xl">
            <div className="rounded-[2.25rem] bg-gradient-to-br from-mint-soft via-white to-accent p-2.5 shadow-card md:p-3">
              <img
                src={a.image}
                alt=""
                width={1024}
                height={656}
                className="aspect-[16/9] w-full rounded-[1.75rem] object-cover"
              />
            </div>
          </Reveal>
        </div>
      </header>

      <article ref={articleRef} className="section-x pb-16">
        <div className="mx-auto max-w-[68ch]">
          <p className="text-xl leading-relaxed font-semibold text-navy md:text-2xl md:leading-relaxed">
            {a.extrait}
          </p>
          <HairStrand className="my-10 h-3 w-24 text-mint" waves={3} amplitude={4} />
          {a.sections.map((s) => (
            <section key={s.titre} className="mt-12 first:mt-0">
              <h2 className="text-display-md text-navy">{s.titre}</h2>
              {s.paragraphes.map((p) => (
                <p key={p} className="mt-4 text-lg leading-8 text-navy/80">
                  {p}
                </p>
              ))}
            </section>
          ))}
          <Link
            to="/blog"
            className="group mt-14 inline-flex h-12 items-center gap-2 rounded-full border border-border bg-white px-5 font-bold text-primary shadow-soft transition-colors hover:border-primary/40"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> Tous
            les articles
          </Link>
        </div>
      </article>

      <section className="section-x pt-4 pb-8">
        <SectionHeading
          align="left"
          size="md"
          title={
            <>
              À lire <Highlight>aussi</Highlight>
            </>
          }
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {autres.map((x, i) => (
            <Reveal key={x.slug} delay={i * 90}>
              <ArticleCard article={x} headingLevel="h3" />
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBanner className="pt-16" />
    </>
  );
}
