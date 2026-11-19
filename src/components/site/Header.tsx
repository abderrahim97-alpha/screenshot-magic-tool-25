import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";

import logo from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Nos services" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-card/95 backdrop-blur">
      <div className="section-x flex h-20 items-center justify-between gap-4">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <img src={logo.url} alt="Poux Chrono 31" className="h-11 w-auto md:h-12" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-accent text-primary" }}
              className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.phoneHref}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-accent md:inline-flex"
          >
            <Phone className="size-4" />
            {site.phoneDisplay}
          </a>
          <Button asChild variant="cta" className="hidden sm:inline-flex">
            <Link to="/contact" search={{}}>
              Prendre rendez-vous
            </Link>
          </Button>
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-11 items-center justify-center rounded-full text-primary transition-colors hover:bg-accent lg:hidden"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <nav className="section-x flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="rounded-xl px-2 py-3 text-base font-semibold text-foreground/85 hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.phoneHref}
              className="mt-1 flex items-center gap-2 px-2 py-3 text-base font-bold text-primary"
            >
              <Phone className="size-5" /> {site.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

export function ScrollingLouse() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const updatePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const phase = (window.scrollY % 360) / 360;
        const bounce = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
        setOffset(Math.round(bounce * 64));
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-3 top-[32%] z-30 size-10 text-primary motion-reduce:hidden"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g className="text-primary" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 24 9 19M17 29 7 31M19 34 12 41M30 24l9-5M31 29l10 2M29 34l7 7" />
          <path d="m21 15-3-5m9 5 4-5" />
        </g>
        <g className="text-destructive" fill="currentColor">
          <ellipse cx="24" cy="29" rx="8.5" ry="12" />
          <ellipse cx="24" cy="17" rx="6" ry="5.5" />
          <path d="M17 26h14M16.5 31h15M17 36h14" stroke="var(--color-destructive-foreground)" strokeWidth="1.5" />
        </g>
        <g className="text-foreground" fill="currentColor">
          <circle cx="22" cy="17" r="1" />
          <circle cx="26" cy="17" r="1" />
        </g>
      </svg>
    </div>
  );
}

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-border bg-card/95 p-3 backdrop-blur sm:hidden">
      <Button asChild variant="outline" size="lg" className="w-full">
        <a href={site.phoneHref}>
          <Phone /> Appeler
        </a>
      </Button>
      <Button asChild variant="cta" size="lg" className="w-full">
        <Link to="/contact" search={{}}>
          RDV en ligne
        </Link>
      </Button>
    </div>
  );
}

export function FloatingContact() {
  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed bottom-24 right-4 z-40 inline-flex size-13 animate-in fade-in zoom-in items-center justify-center rounded-full bg-mint text-mint-foreground shadow-card transition-transform hover:scale-105 sm:bottom-6"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
