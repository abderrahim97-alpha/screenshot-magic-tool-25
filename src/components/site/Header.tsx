import * as Dialog from "@radix-ui/react-dialog";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Home,
  ListChecks,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import logo from "@/assets/poux-chrono-31-logo.webp";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/services", label: "Nos services", icon: Sparkles },
  { to: "/comment-ca-marche", label: "Comment ça marche", icon: ListChecks },
  { to: "/blog", label: "Blog", icon: BookOpen },
  { to: "/contact", label: "Contact", icon: Mail },
] as const satisfies readonly { to: string; label: string; icon: LucideIcon }[];

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function activeIndex(pathname: string) {
  return nav.findIndex((item) =>
    item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`),
  );
}

function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-2", className)} aria-hidden="true">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70 motion-reduce:hidden" />
      <span className="relative inline-flex size-2 rounded-full bg-mint" />
    </span>
  );
}

/* ============================================================== Header */

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {/* Announcement bar — scrolls away naturally (not sticky, so no layout jump) */}
      <div className="relative z-[51] bg-navy text-white">
        <div className="section-x flex h-9 items-center justify-center gap-3 text-xs font-semibold sm:justify-between">
          <p className="flex items-center gap-2">
            <LiveDot />
            <span>Disponible aujourd'hui</span>
            <span className="hidden text-white/40 sm:inline">·</span>
            <span className="hidden text-white/70 sm:inline">{site.horaires}</span>
          </p>
          <div className="hidden items-center gap-4 sm:flex">
            <span className="hidden items-center gap-1.5 text-white/70 md:inline-flex">
              <Star className="size-3.5 fill-star text-star" aria-hidden="true" /> 4,9/5 · +2000 familles accompagnées
            </span>
            <a href={site.phoneHref} className="inline-flex items-center gap-1.5 transition-colors hover:text-mint">
              <Phone className="size-3.5 text-mint" aria-hidden="true" /> {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 h-16 lg:h-20">
        <div className={cn("transition-[padding] duration-500 ease-out", scrolled ? "px-3 pt-2 lg:pt-3" : "px-0 pt-0")}>
          <div
            className={cn(
              "relative mx-auto flex items-center justify-between gap-3 transition-[max-width,height,border-radius,background-color,box-shadow,padding] duration-500 ease-out",
              scrolled
                ? "h-12 max-w-6xl rounded-full border border-white/70 bg-white/85 pr-1.5 pl-4 shadow-card backdrop-blur-xl backdrop-saturate-150 lg:h-14 lg:pr-2 lg:pl-6"
                : "h-16 max-w-[76rem] border-b border-transparent bg-background/70 px-5 backdrop-blur-md md:px-8 lg:h-20",
            )}
          >
            <Link
              to="/"
              className="group flex min-h-11 shrink-0 items-center rounded-lg"
              aria-label="Poux Chrono 31 — Accueil"
            >
              <img
                src={logo}
                alt="Poux Chrono 31"
                className={cn(
                  "w-auto transition-[height,transform] duration-500 group-hover:scale-[1.03]",
                  scrolled ? "h-8 lg:h-10" : "h-10 lg:h-12",
                )}
              />
            </Link>

            <DesktopNav pathname={pathname} />

            <div className="flex items-center gap-1.5">
              <a
                href={site.phoneHref}
                className="group hidden items-center gap-2.5 rounded-full py-1.5 pr-3 pl-1.5 text-sm font-bold text-navy transition-colors hover:bg-accent/70 xl:inline-flex"
              >
                <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Phone className="size-4" />
                  <LiveDot className="absolute -top-0.5 -right-0.5 ring-2 ring-white rounded-full" />
                </span>
                {site.phoneDisplay}
              </a>
              <Button
                asChild
                variant="cta"
                size={scrolled ? "sm" : "default"}
                className="pc-shine relative hidden overflow-hidden sm:inline-flex"
              >
                <Link to="/contact" search={{}}>
                  Prendre rendez-vous
                  <ArrowRight data-arrow />
                </Link>
              </Button>
              <MobileMenu open={open} onOpenChange={setOpen} pathname={pathname} />
            </div>

            {/* Gradient hairline under the pill when scrolled */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-x-10 -bottom-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-500",
                scrolled ? "opacity-100" : "opacity-0",
              )}
            />
          </div>
        </div>
      </header>
    </>
  );
}

/* ========================================================= Desktop nav */

function DesktopNav({ pathname }: { pathname: string }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const current = activeIndex(pathname);
  const target = hover ?? current;

  useIsoLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const el = list?.querySelectorAll<HTMLElement>("[data-nav-item]")[target];
      if (!list || !el) return setIndicator(null);
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [target]);

  return (
    <nav aria-label="Navigation principale" className="hidden lg:block">
      <div
        ref={listRef}
        onPointerLeave={() => setHover(null)}
        className="relative flex items-center gap-0.5 rounded-full bg-secondary/60 p-1 ring-1 ring-border/50"
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1 bottom-1 rounded-full bg-white shadow-soft ring-1 ring-border/60 transition-[left,width,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
            indicator ? "opacity-100" : "opacity-0",
          )}
          style={indicator ? { left: indicator.left, width: indicator.width } : undefined}
        />
        {nav.map((item, i) => (
          <Link
            key={item.to}
            to={item.to}
            data-nav-item
            onPointerEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className={cn(
              "relative z-10 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-colors",
              i === current ? "text-primary" : "text-navy/70 hover:text-navy",
            )}
          >
            {i === current && <span aria-hidden="true" className="size-1.5 rounded-full bg-mint" />}
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/* ========================================================= Mobile menu */

function MobileMenu({
  open,
  onOpenChange,
  pathname,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pathname: string;
}) {
  const current = activeIndex(pathname);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Ouvrir le menu"
          className="inline-flex size-11 items-center justify-center rounded-full bg-secondary/70 text-navy ring-1 ring-border/50 transition-colors hover:bg-accent lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-background data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="pc-aurora absolute -top-24 -right-24 size-80 rounded-full bg-mint/25 blur-3xl" />
            <div className="pc-aurora absolute bottom-10 -left-24 size-80 rounded-full bg-primary/15 blur-3xl [animation-delay:-6s]" />
            <div className="absolute inset-0 [background-image:radial-gradient(rgb(23_32_58/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(black,transparent_60%)]" />
          </div>

          <div className="flex h-16 items-center justify-between px-5">
            <Dialog.Title className="sr-only">Menu</Dialog.Title>
            <img src={logo} alt="Poux Chrono 31" className="h-10 w-auto" />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Fermer le menu"
                className="inline-flex size-11 items-center justify-center rounded-full bg-navy text-white shadow-soft transition-transform hover:rotate-90"
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="px-5 pt-2 animate-in fade-in slide-in-from-top-2 fill-mode-both duration-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-mint-soft px-3 py-1.5 text-xs font-bold text-mint-ink">
              <LiveDot /> Disponible aujourd'hui · {site.horaires}
            </span>
          </div>

          <nav aria-label="Navigation mobile" className="flex flex-1 flex-col justify-center gap-2 px-5 py-6">
            {nav.map((item, i) => {
              const active = i === current;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "group flex items-center gap-4 rounded-[1.5rem] p-3 pr-4 animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500",
                    active ? "bg-white shadow-card ring-1 ring-border/60" : "hover:bg-white/70",
                  )}
                  style={{ animationDelay: `${80 + i * 60}ms` }}
                >
                  <span
                    className={cn(
                      "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                      active ? "bg-primary text-white" : "bg-accent text-primary",
                    )}
                  >
                    <item.icon className="size-5" />
                  </span>
                  <span
                    className={cn(
                      "flex-1 font-display text-[clamp(1.35rem,6vw,1.9rem)] leading-tight font-semibold tracking-tight",
                      active ? "text-primary" : "text-navy",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="font-sans text-xs font-bold text-navy/30 tabular-nums">0{i + 1}</span>
                  <ArrowRight className="size-5 text-navy/30 transition-[color,transform] group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              );
            })}
          </nav>

          <div
            className="grid gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-500"
            style={{ animationDelay: "420ms" }}
          >
            <div className="grid grid-cols-2 gap-3">
              <a
                href={site.phoneHref}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-border/60"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-white">
                  <Phone className="size-4" />
                </span>
                <span className="text-sm font-bold text-navy">Appeler</span>
              </a>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-border/60"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-mint text-white">
                  <MessageCircle className="size-4" />
                </span>
                <span className="text-sm font-bold text-navy">WhatsApp</span>
              </a>
            </div>
            <Button asChild variant="cta" size="lg" className="pc-shine relative overflow-hidden">
              <Link to="/contact" search={{}} onClick={() => onOpenChange(false)}>
                Prendre rendez-vous
                <ArrowRight data-arrow />
              </Link>
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
              <Star className="size-3.5 fill-star text-star" aria-hidden="true" /> 4,9/5 · +2000 familles accompagnées
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}