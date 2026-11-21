import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, MessageCircle, Phone, X, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-2", className)} aria-hidden="true">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70 motion-reduce:hidden" />
      <span className="relative inline-flex size-2 rounded-full bg-mint" />
    </span>
  );
}

/* ====================================================================
 * Mobile only: floating dock — Appeler · WhatsApp · Prendre rendez-vous.
 * Hides while scrolling down, comes back on scroll up / near the bottom.
 * ================================================================== */

export function MobileDock() {
  const [hidden, setHidden] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const nearBottom = window.innerHeight + y >= document.documentElement.scrollHeight - 80;
        const delta = y - lastY;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 160 && !nearBottom);
          lastY = y;
        }
        if (nearBottom || y < 160) setHidden(false);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Always show it again after a page change.
  useEffect(() => setHidden(false), [pathname]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:hidden",
        hidden ? "translate-y-[calc(100%+1rem)]" : "translate-y-0",
      )}
    >
      <nav
        aria-label="Actions rapides"
        className="glass pointer-events-auto mx-auto flex max-w-md items-center gap-1 rounded-full p-1.5 shadow-card ring-1 ring-white/70"
      >
        <a
          href={site.phoneHref}
          className="group flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full text-xs font-bold text-navy transition-colors active:bg-accent"
        >
          <span className="relative inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-transform group-active:scale-90">
            <Phone className="size-4" aria-hidden="true" />
            <LiveDot className="absolute -top-0.5 -right-0.5 rounded-full ring-2 ring-white" />
          </span>
          <span className="max-[359px]:sr-only">Appeler</span>
        </a>
        <a
          href={site.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="group flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full text-xs font-bold text-navy transition-colors active:bg-mint-soft"
        >
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-mint text-white transition-transform group-active:scale-90">
            <MessageCircle className="size-4" aria-hidden="true" />
          </span>
          <span className="max-[359px]:sr-only">WhatsApp</span>
        </a>
        <Link
          to="/contact"
          search={{}}
          className="pc-shine relative flex h-12 flex-none items-center justify-center gap-1.5 overflow-hidden rounded-full bg-destructive px-4 text-[0.8125rem] font-bold whitespace-nowrap text-white shadow-glow transition-transform active:scale-[0.97]"
        >
          <span className="max-[379px]:hidden">Prendre rendez-vous</span>
          <span className="min-[380px]:hidden">Rendez-vous</span>
          <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
        </Link>
      </nav>
    </div>
  );
}

/* ====================================================================
 * Desktop / tablet: contact "speed dial".
 * Click the bubble → WhatsApp, Appeler and Rendez-vous fan out.
 * A small greeting appears once per visit after a few seconds.
 * ================================================================== */

const GREETING_KEY = "pc31-greeting-dismissed";

export function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Greeting bubble: once per session, after 6s, not on the contact page.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(GREETING_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
    if (dismissed || pathname === "/contact") return;
    const t = window.setTimeout(() => setGreeting(true), 6000);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const dismissGreeting = () => {
    setGreeting(false);
    try {
      sessionStorage.setItem(GREETING_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  };

  // Close on Escape / outside click / page change.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);

  const toggle = () => {
    setOpen((o) => !o);
    dismissGreeting();
  };

  const actions: {
    key: string;
    label: string;
    icon: LucideIcon;
    tone: string;
    href?: string;
    external?: boolean;
    to?: "/contact";
  }[] = [
    { key: "rdv", label: "Prendre rendez-vous", icon: CalendarCheck, tone: "bg-destructive text-white", to: "/contact" },
    { key: "tel", label: site.phoneDisplay, icon: Phone, tone: "bg-primary text-white", href: site.phoneHref },
    { key: "wa", label: "WhatsApp", icon: MessageCircle, tone: "bg-mint text-white", href: site.whatsappHref, external: true },
  ];

  return (
    <div ref={rootRef} className="fixed right-6 bottom-6 z-40 hidden flex-col items-end gap-3 sm:flex">
      {/* Actions */}
      <ul id="contact-dial" aria-hidden={!open} className="flex flex-col items-end gap-2.5">
        {actions.map((a, i) => {
          const delay = `${(actions.length - 1 - i) * 50}ms`;
          const inner = (
            <>
              <span className="glass rounded-full px-3.5 py-2 text-sm font-bold whitespace-nowrap text-navy shadow-soft transition-transform duration-300 group-hover:-translate-x-1">
                {a.label}
              </span>
              <span
                className={cn(
                  "inline-flex size-12 items-center justify-center rounded-full shadow-card transition-transform duration-300 group-hover:scale-110",
                  a.tone,
                )}
              >
                <a.icon className="size-5" aria-hidden="true" />
              </span>
            </>
          );
          const cls = "group flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30";
          return (
            <li
              key={a.key}
              className={cn(
                "transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0",
              )}
              style={{ transitionDelay: open ? delay : "0ms" }}
            >
              {a.to ? (
                <Link to={a.to} search={{}} tabIndex={open ? 0 : -1} className={cls}>
                  {inner}
                </Link>
              ) : (
                <a
                  href={a.href}
                  tabIndex={open ? 0 : -1}
                  {...(a.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className={cls}
                >
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {/* Greeting bubble */}
      <div
        role="status"
        className={cn(
          "relative mr-1 w-64 origin-bottom-right rounded-[1.25rem] rounded-br-md bg-white p-4 pr-9 shadow-card ring-1 ring-border/60 transition-[opacity,transform] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          greeting && !open ? "scale-100 opacity-100" : "pointer-events-none absolute right-0 bottom-20 scale-90 opacity-0",
        )}
      >
        <button
          type="button"
          onClick={dismissGreeting}
          aria-label="Fermer"
          className="absolute top-2.5 right-2.5 inline-flex size-6 cursor-pointer items-center justify-center rounded-full text-navy/40 transition-colors hover:bg-accent hover:text-navy"
        >
          <X className="size-3.5" />
        </button>
        <p className="flex items-center gap-2 text-xs font-bold text-mint-ink">
          <LiveDot /> Disponible aujourd'hui
        </p>
        <p className="mt-1.5 font-display text-base leading-snug font-semibold text-navy">Besoin d'aide ?</p>
        <button
          type="button"
          onClick={toggle}
          className="mt-2 inline-flex cursor-pointer items-center gap-1 text-sm font-bold text-primary hover:underline"
        >
          On vous rappelle dans la journée <ArrowRight className="size-3.5" />
        </button>
      </div>

      {/* Main bubble */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="contact-dial"
        aria-label={open ? "Fermer" : "Nous contacter"}
        className={cn(
          "relative inline-flex size-14 cursor-pointer items-center justify-center rounded-full text-white shadow-card ring-4 ring-white/70 transition-[background-color,transform] duration-300 animate-in fade-in zoom-in hover:-translate-y-1",
          open ? "bg-navy" : "bg-mint-ink",
        )}
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-mint/40 [animation-duration:2.6s] motion-reduce:hidden" />
        )}
        <MessageCircle
          className={cn(
            "absolute size-6 transition-[opacity,transform] duration-300",
            open ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
          )}
        />
        <X
          className={cn(
            "absolute size-6 transition-[opacity,transform] duration-300",
            open ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
          )}
        />
        {greeting && !open && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex size-4 items-center justify-center rounded-full bg-destructive text-[0.6rem] font-bold ring-2 ring-white">
            1
          </span>
        )}
      </button>
    </div>
  );
}