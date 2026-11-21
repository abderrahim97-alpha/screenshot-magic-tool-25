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
  const [isCrawling, setIsCrawling] = useState(false);

  useEffect(() => {
    let frame = 0;
    let stopTimer = 0;

    const updatePosition = () => {
      setIsCrawling(true);
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => setIsCrawling(false), 180);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const phase = (window.scrollY % 360) / 360;
        const climb = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
        setOffset(Math.round(climb * 150));
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(stopTimer);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed right-0 top-[27%] z-30 h-[200px] w-16 text-primary motion-reduce:hidden ${isCrawling ? "is-crawling" : ""}`}
    >
      <svg viewBox="0 0 64 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(11 0)">
          <path
            d="M32 4C27 29 37 48 32 69S27 110 33 132s-4 44-1 64"
            stroke="currentColor"
            strokeOpacity=".55"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M34 5C29 30 39 49 34 70s-5 41 1 62-4 43-1 62"
            stroke="currentColor"
            strokeOpacity=".2"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <g transform={`translate(32 ${20 + offset})`}>
            <g className="louse-legs-left" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M-5-5-12-9l-3 3M-7 1l-9-1-3 4M-6 8l-7 5 1 4" />
            </g>
            <g className="louse-legs-right" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5-5 12-9l3 3M7 1 16 0l3 4M6 8l7 5-1 4" />
            </g>
            <g className="louse-body">
              <ellipse cx="0" cy="5" rx="7" ry="11" fill="var(--color-destructive)" />
              <circle cx="0" cy="-8" r="6" fill="var(--color-destructive)" />
              <path d="M-4-11-7-16M4-11l3-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M-6 1h12M-7 6h14M-6 11h12" stroke="var(--color-destructive-foreground)" strokeWidth="1.5" />
              <circle cx="-2" cy="-9" r="1" fill="var(--color-destructive-foreground)" />
              <circle cx="2" cy="-9" r="1" fill="var(--color-destructive-foreground)" />
            </g>
          </g>
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
