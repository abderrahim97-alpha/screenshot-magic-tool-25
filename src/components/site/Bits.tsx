import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { Eyebrow } from "@/components/site/Kit";
import { Reveal } from "@/components/site/Reveal";
import { HairStrand, withHighlight } from "@/components/site/Strand";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Crumb = { label: string; to?: string };

/** Inner-page hero: breadcrumb + eyebrow + title in a soft gradient with strand decoration. */
export function PageHeader({
  eyebrow,
  titre,
  intro,
  highlight,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  titre: string;
  intro?: string;
  /** Word of the title underlined with the strand. */
  highlight?: string;
  breadcrumb?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pt-6 pb-14 md:pt-10 md:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 size-[34rem] rounded-full bg-accent blur-3xl" />
        <div className="absolute -top-20 right-[-10rem] size-[30rem] rounded-full bg-mint-soft blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
        <HairStrand
          className="absolute top-10 right-[-4rem] h-64 w-[38rem] rotate-[-8deg] text-primary/15 max-md:hidden"
          waves={4}
          amplitude={22}
          strokeWidth={1.5}
        />
        <HairStrand
          className="absolute top-24 right-[-6rem] h-56 w-[34rem] rotate-[-4deg] text-mint/25 max-md:hidden"
          waves={3}
          amplitude={18}
          strokeWidth={1.5}
          delay={400}
        />
      </div>
      <div className="section-x">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <Reveal load className="mt-8 max-w-3xl md:mt-12">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-4 text-display-xl text-navy">{withHighlight(titre, highlight)}</h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {intro}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn("text-sm", className)}>
      <ol className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full bg-white/70 px-3 py-1.5 text-muted-foreground shadow-soft ring-1 ring-border/60 backdrop-blur">
        <li>
          <Link to="/" className="rounded-full px-1.5 py-1 transition-colors hover:text-primary">
            Accueil
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex min-w-0 items-center gap-1">
            <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
            {item.to ? (
              <Link
                to={item.to}
                className="rounded-full px-1.5 py-1 transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate px-1.5 py-1 font-semibold text-navy">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CtaBanner({ className }: { className?: string }) {
  return (
    <section className={cn("section-x", className)}>
      <Reveal
        variant="scale"
        className="mesh-cta grain relative overflow-hidden rounded-[2rem] px-6 py-14 text-center text-white shadow-card md:rounded-[2.5rem] md:px-12 md:py-20"
      >
        <HairStrand
          className="pointer-events-none absolute top-8 left-0 h-6 w-full text-white/15"
          waves={8}
          amplitude={8}
          strokeWidth={1.5}
        />
        <HairStrand
          className="pointer-events-none absolute bottom-10 left-0 h-6 w-full text-mint/30"
          waves={6}
          amplitude={8}
          strokeWidth={1.5}
          delay={500}
        />
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint/25 blur-3xl" />
        <h2 className="mx-auto max-w-2xl text-display-lg text-white">
          Une situation à régler rapidement ? On est là.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/75">
          Un appel suffit pour être fixé. On vous rappelle dans la journée et on trouve un créneau
          qui vous arrange.
        </p>
        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button asChild variant="cta" size="lg">
            <Link to="/contact" search={{}}>
              Prendre rendez-vous
              <ArrowRight data-arrow />
            </Link>
          </Button>
          <Button asChild variant="glass" size="lg">
            <a href={site.phoneHref}>
              <Phone /> {site.phoneDisplay}
            </a>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
