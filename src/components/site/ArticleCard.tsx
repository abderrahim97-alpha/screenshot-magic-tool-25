import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";

import type { Article } from "@/lib/blog";

export function ArticleCard({
  article: a,
  headingLevel: Heading = "h2",
}: {
  article: Article;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: a.slug }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-white shadow-soft transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-card focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-mint-soft to-accent">
        <img
          src={a.image}
          alt=""
          loading="lazy"
          width={1024}
          height={656}
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-navy opacity-0 shadow-soft transition-[opacity,transform] duration-500 group-hover:rotate-45 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold tracking-[0.14em] text-mint-ink uppercase">{a.categorie}</p>
        <Heading className="mt-3 text-xl leading-snug text-navy transition-colors group-hover:text-primary">
          {a.titre}
        </Heading>
        <p className="mt-3 flex-1 text-muted-foreground">{a.extrait}</p>
        <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-4" /> {a.lecture} de lecture
        </p>
      </div>
    </Link>
  );
}
