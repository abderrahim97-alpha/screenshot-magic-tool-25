import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  titre,
  intro,
  children,
}: {
  eyebrow?: string;
  titre: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="bg-secondary/60 py-14">
      <div className="section-x max-w-3xl">
        {eyebrow && (
          <span className="text-sm font-bold uppercase tracking-wide text-mint">{eyebrow}</span>
        )}
        <h1 className="mt-2 text-3xl md:text-4xl">{titre}</h1>
        {intro && <p className="mt-4 text-lg text-muted-foreground">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="section-x pt-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-primary">
            Accueil
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {item.to ? (
              <Link to={item.to} className="hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground/80">{item.label}</span>
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
      <div className="rounded-3xl bg-primary px-6 py-12 text-center shadow-card md:px-12">
        <h2 className="text-2xl text-primary-foreground md:text-3xl">
          Une situation à régler rapidement ? On est là.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
          Un appel suffit pour être fixé. On vous rappelle dans la journée et on trouve un créneau
          qui vous arrange.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="cta" size="lg">
            <Link to="/contact">Prendre rendez-vous</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href={site.phoneHref}>
              <Phone /> {site.phoneDisplay}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
