import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Link2,
  ListOrdered,
  MessageCircle,
  Phone,
} from "lucide-react";
import { useEffect, useRef, useState, type RefObject } from "react";

import { ArticleCard } from "@/components/site/ArticleCard";
import { NotFoundIllustration } from "@/components/site/NotFoundIllustration";
import { Breadcrumb, CtaBanner } from "@/components/site/Bits";
import { Pill, SectionHeading } from "@/components/site/Kit";
import { Reveal } from "@/components/site/Reveal";
import { HairStrand, Highlight } from "@/components/site/Strand";
import { Button } from "@/components/ui/button";
import { articles, getArticle } from "@/lib/blog";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

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

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function ArticleNotFound() {
  return (
    <div className="section-x py-28 text-center">
      <NotFoundIllustration />
      <h1 className="mt-8 text-display-lg text-navy">Article introuvable</h1>
      <Button asChild className="mt-8" size="lg">
        <Link to="/blog">Retour au blog</Link>
      </Button>
    </div>
  );
}

/* ===================================================== Reading progress */

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

/* ============================================================== Share */

function ShareButtons({ titre }: { titre: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  const whatsapp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${titre} ${window.location.href}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-muted-foreground">Partager</span>
      <button
        type="button"
        onClick={copy}
        aria-label="Copier le lien"
        className={cn(
          "inline-flex size-10 cursor-pointer items-center justify-center rounded-full ring-1 transition-colors",
          copied ? "bg-mint text-white ring-mint" : "bg-white text-navy ring-border hover:bg-accent",
        )}
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </button>
      <button
        type="button"
        onClick={whatsapp}
        aria-label="Partager sur WhatsApp"
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white text-mint-ink ring-1 ring-border transition-colors hover:bg-mint-soft"
      >
        <MessageCircle className="size-4" />
      </button>
      <span role="status" className={cn("text-xs font-bold text-mint-ink transition-opacity", copied ? "opacity-100" : "opacity-0")}>
        Lien copié
      </span>
    </div>
  );
}

/* ================================================================ TOC */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Toc({ items, active }: { items: { id: string; titre: string }[]; active: string }) {
  const activeIndex = Math.max(0, items.findIndex((i) => i.id === active));
  return (
    <nav aria-label="Sommaire">
      <p className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-mint-ink uppercase">
        <ListOrdered className="size-4" aria-hidden="true" /> Sommaire
      </p>
      <ol className="relative mt-4 space-y-1 border-l-2 border-border/70">
        <span
          aria-hidden="true"
          className="absolute -left-0.5 w-0.5 rounded-full bg-primary transition-[top,height] duration-500 ease-out"
          style={{ top: `${(activeIndex / items.length) * 100}%`, height: `${100 / items.length}%` }}
        />
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={cn(
                "flex gap-2.5 py-2 pl-4 text-sm leading-snug transition-colors",
                active === it.id ? "font-bold text-navy" : "text-muted-foreground hover:text-navy",
              )}
            >
              <span className={cn("font-display text-xs font-bold", active === it.id ? "text-primary" : "text-navy/30")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {it.titre}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ========================================================= Inline CTA */

function InlineCta() {
  return (
    <aside className="relative isolate my-12 overflow-hidden rounded-[2rem] bg-navy p-6 text-white shadow-card md:p-8">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-16 size-60 rounded-full bg-primary/60 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 size-52 rounded-full bg-mint/25 blur-3xl" />
      </div>
      <HairStrand className="absolute top-4 right-0 left-0 -z-10 h-4 text-white/10" waves={6} amplitude={4} strokeWidth={1.5} />
      <Pill live tone="dark" className="text-xs">
        Disponible aujourd'hui
      </Pill>
      <p className="mt-4 font-display text-2xl leading-snug font-semibold text-white md:text-3xl">
        Une situation à régler rapidement ? On est là.
      </p>
      <p className="mt-3 text-white/70">
        Un appel suffit pour être fixé. On vous rappelle dans la journée et on trouve un créneau qui vous arrange.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="cta" size="lg" className="pc-shine relative overflow-hidden">
          <Link to="/contact" search={{}}>
            Prendre rendez-vous
            <ArrowRight data-arrow />
          </Link>
        </Button>
        <Button asChild size="lg" className="bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15">
          <a href={site.phoneHref}>
            <Phone /> {site.phoneDisplay}
          </a>
        </Button>
      </div>
    </aside>
  );
}

/* ================================================================ Page */

function ArticlePage() {
  const { article: a } = Route.useLoaderData();
  const articleRef = useRef<HTMLElement>(null);
  const [tocOpen, setTocOpen] = useState(false);

  const toc = a.sections.map((s) => ({ id: slugify(s.titre), titre: s.titre }));
  const ids = toc.map((t) => t.id);
  const active = useActiveSection(ids);

  // Related: same category first, then the rest.
  const others = articles.filter((x) => x.slug !== a.slug);
  const autres = [
    ...others.filter((x) => x.categorie === a.categorie),
    ...others.filter((x) => x.categorie !== a.categorie),
  ].slice(0, 3);

  const index = articles.findIndex((x) => x.slug === a.slug);
  const suivant = articles[(index + 1) % articles.length];

  return (
    <>
      <ReadingProgress target={articleRef} />

      {/* ---------- Hero */}
      <header className="relative isolate overflow-hidden pt-6 md:pt-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%]">
          <div className="pc-aurora absolute -top-40 -left-32 size-[32rem] rounded-full bg-accent blur-3xl" />
          <div className="pc-aurora absolute -top-20 right-[-10rem] size-[28rem] rounded-full bg-mint-soft blur-3xl [animation-delay:-7s]" />
        </div>

        <div className="section-x">
          <Breadcrumb items={[{ label: "Blog", to: "/blog" }, { label: a.titre }]} />

          <Reveal load className="mx-auto mt-10 max-w-3xl text-center md:mt-16">
            <Pill tone="mint" className="text-xs">
              {a.categorie}
            </Pill>
            <h1 className="mt-6 text-display-lg text-balance text-navy">{a.titre}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground md:text-xl">
              {a.extrait}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-navy/70">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-primary" /> {a.lecture} de lecture
              </span>
              <span aria-hidden="true" className="size-1 rounded-full bg-navy/25" />
              <span className="inline-flex items-center gap-1.5">
                <ListOrdered className="size-4 text-primary" /> {toc.length} parties
              </span>
            </div>
          </Reveal>

          <Reveal load delay={120} className="mx-auto mt-10 max-w-5xl md:mt-14">
            <img
              src={a.image}
              alt={a.titre}
              width={1586}
              height={992}
              fetchPriority="high"
              className="aspect-[16/9] w-full rounded-[2rem] bg-gradient-to-br from-mint-soft to-accent object-cover shadow-card md:rounded-[2.5rem]"
            />
          </Reveal>
        </div>
      </header>

      {/* ---------- Body: TOC | content | aside — content is centred under the hero */}
      <article ref={articleRef} className="section-x pt-12 pb-20 md:pt-16">
        <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)_13rem] lg:gap-12 xl:grid-cols-[14rem_minmax(0,1fr)_14rem]">
          {/* Left: sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <Toc items={toc} active={active} />
            </div>
          </aside>

          {/* Centre: reading column */}
          <div className="mx-auto w-full max-w-[68ch]">
            {/* Mobile TOC */}
            <div className="mb-10 overflow-hidden rounded-2xl bg-white ring-1 ring-border/70 lg:hidden">
              <button
                type="button"
                onClick={() => setTocOpen((o) => !o)}
                aria-expanded={tocOpen}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-bold text-navy"
              >
                <span className="flex items-center gap-2">
                  <ListOrdered className="size-4 text-primary" /> Sommaire
                </span>
                <ChevronDown className={cn("size-5 transition-transform duration-300", tocOpen && "rotate-180")} />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-out",
                  tocOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <ol className="overflow-hidden">
                  {toc.map((t, i) => (
                    <li key={t.id} className="border-t border-border/60">
                      <a
                        href={`#${t.id}`}
                        onClick={() => setTocOpen(false)}
                        className="flex gap-3 px-4 py-3 text-sm text-navy"
                      >
                        <span className="font-display text-xs font-bold text-primary">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {t.titre}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {a.sections.map((s, i) => (
              <div key={s.titre}>
                <section id={slugify(s.titre)} className="scroll-mt-28">
                  <div className={cn(i > 0 && "mt-14")}>
                    <p className="font-display text-sm font-bold tracking-[0.2em] text-mint-ink">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-2 text-display-md text-balance text-navy">{s.titre}</h2>
                  </div>
                  {s.paragraphes.map((p, j) => (
                    <p
                      key={p}
                      className={cn(
                        "mt-5 text-lg leading-8 text-pretty text-navy/80",
                        i === 0 &&
                          j === 0 &&
                          "first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:font-bold first-letter:text-primary",
                      )}
                    >
                      {p}
                    </p>
                  ))}
                </section>
                {i === 1 && a.sections.length > 2 && <InlineCta />}
              </div>
            ))}

            {/* End of article */}
            <div className="mt-16 flex flex-col gap-5 border-t border-border/70 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 font-bold text-primary"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> Tous les articles
              </Link>
              <ShareButtons titre={a.titre} />
            </div>

            {suivant && suivant.slug !== a.slug && (
              <Link
                to="/blog/$slug"
                params={{ slug: suivant.slug }}
                className="group relative isolate mt-8 flex min-h-36 items-end overflow-hidden rounded-[1.75rem] p-6 shadow-card"
              >
                <img
                  src={suivant.image}
                  alt=""
                  loading="lazy"
                  width={1586}
                  height={992}
                  className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/80 to-navy/30" />
                <div className="min-w-0 flex-1 text-white">
                  <p className="text-xs font-bold tracking-[0.18em] text-mint uppercase">Article suivant</p>
                  <p className="mt-2 max-w-md font-display text-xl leading-snug font-semibold">{suivant.titre}</p>
                </div>
                <span
                  aria-hidden="true"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-navy transition-all duration-500 group-hover:rotate-45 group-hover:bg-destructive group-hover:text-white"
                >
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            )}
          </div>

          {/* Right: sticky share + help */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              <div className="rounded-[1.5rem] bg-white p-5 shadow-soft ring-1 ring-border/60">
                <p className="font-display text-base font-semibold text-navy">Besoin d'aide ?</p>
                <p className="mt-1.5 text-sm text-muted-foreground">On vous rappelle dans la journée.</p>
                <Button asChild variant="cta" className="mt-4 w-full">
                  <a href={site.phoneHref}>
                    <Phone className="size-4" /> {site.phoneDisplay}
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* ---------- Related */}
      <section className="bg-secondary/50 py-16 md:py-20">
        <div className="section-x">
          <SectionHeading align="left" size="md" title={<>À lire <Highlight>aussi</Highlight></>} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {autres.map((x, i) => (
              <Reveal key={x.slug} delay={i * 90}>
                <ArticleCard article={x} headingLevel="h3" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner className="pt-16 md:pt-24" />
    </>
  );
}