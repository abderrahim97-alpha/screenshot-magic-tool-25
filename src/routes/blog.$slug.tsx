import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";

import { Breadcrumb, CtaBanner } from "@/components/site/Bits";
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
    <div className="section-x py-24 text-center">
      <h1 className="text-3xl">Article introuvable</h1>
      <Button asChild className="mt-6">
        <Link to="/blog">Retour au blog</Link>
      </Button>
    </div>
  );
}

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const autres = articles.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <Breadcrumb items={[{ label: "Blog", to: "/blog" }, { label: a.titre }]} />
      <article className="section-x max-w-3xl py-10">
        <p className="text-sm font-bold uppercase tracking-wide text-mint">{a.categorie}</p>
        <h1 className="mt-2 text-3xl md:text-4xl">{a.titre}</h1>
        <p className="mt-3 inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="size-4" /> {a.lecture} de lecture
        </p>
        <img
          src={a.image}
          alt=""
          className="mt-6 aspect-[16/9] w-full rounded-3xl object-cover shadow-card"
        />
        <p className="mt-8 text-lg font-semibold text-foreground/90">{a.extrait}</p>
        {a.sections.map((s) => (
          <section key={s.titre} className="mt-8">
            <h2 className="text-2xl">{s.titre}</h2>
            {s.paragraphes.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-foreground/85">
                {p}
              </p>
            ))}
          </section>
        ))}
        <Link
          to="/blog"
          className="mt-10 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Tous les articles
        </Link>
      </article>
      <section className="section-x pb-12">
        <h2 className="text-2xl">À lire aussi</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {autres.map((x) => (
            <Link
              key={x.slug}
              to="/blog/$slug"
              params={{ slug: x.slug }}
              className="group overflow-hidden rounded-3xl bg-card shadow-soft"
            >
              <img src={x.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <p className="p-4 font-display font-bold group-hover:text-primary">{x.titre}</p>
            </Link>
          ))}
        </div>
      </section>
      <CtaBanner className="pb-16" />
    </>
  );
}
