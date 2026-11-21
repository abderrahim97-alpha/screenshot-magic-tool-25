import * as Dialog from "@radix-ui/react-dialog";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import logo from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Nos services" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function activeIndex(pathname: string) {
  return nav.findIndex((item) =>
    item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`),
  );
}

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
    <header className="sticky top-0 z-50 h-16 lg:h-20">
      <div
        className={cn(
          "transition-[padding] duration-500 ease-out",
          scrolled ? "px-3 pt-2 lg:pt-3" : "px-0 pt-0",
        )}
      >
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-3 transition-[max-width,height,border-radius,background-color,box-shadow,padding] duration-500 ease-out",
            scrolled
              ? "glass h-12 max-w-6xl rounded-full pl-4 pr-1.5 shadow-card lg:h-14 lg:pl-6 lg:pr-2"
              : "h-16 max-w-[76rem] border-b border-transparent bg-background/70 px-5 backdrop-blur-md md:px-8 lg:h-20",
          )}
        >
          <Link to="/" className="shrink-0 rounded-lg" aria-label="Poux Chrono 31 — Accueil">
            <img
              src={logo.url}
              alt="Poux Chrono 31"
              className={cn(
                "w-auto transition-[height] duration-500",
                scrolled ? "h-8 lg:h-10" : "h-10 lg:h-12",
              )}
            />
          </Link>

          <DesktopNav pathname={pathname} />

          <div className="flex items-center gap-1.5">
            <a
              href={site.phoneHref}
              className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-navy transition-colors hover:text-primary xl:inline-flex"
            >
              <Phone className="size-4 text-primary" />
              {site.phoneDisplay}
            </a>
            <Button
              asChild
              variant="cta"
              size={scrolled ? "sm" : "default"}
              className="hidden sm:inline-flex"
            >
              <Link to="/contact" search={{}}>
                Prendre rendez-vous
                <ArrowRight data-arrow />
              </Link>
            </Button>
            <MobileMenu open={open} onOpenChange={setOpen} pathname={pathname} />
          </div>
        </div>
      </div>
    </header>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);
  const current = activeIndex(pathname);

  useIsoLayoutEffect(() => {
    const measure = () => {
      const list = listRef.current;
      const el = list?.querySelectorAll<HTMLElement>("[data-nav-item]")[current];
      if (!list || !el) return setIndicator(null);
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [current]);

  return (
    <nav aria-label="Navigation principale" className="hidden lg:block">
      <div ref={listRef} className="relative flex items-center gap-0.5 rounded-full p-1">
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1 bottom-1 rounded-full bg-accent transition-[left,width,opacity] duration-500 ease-out",
            indicator ? "opacity-100" : "opacity-0",
          )}
          style={indicator ? { left: indicator.left, width: indicator.width } : undefined}
        />
        {nav.map((item, i) => (
          <Link
            key={item.to}
            to={item.to}
            data-nav-item
            className={cn(
              "relative z-10 rounded-full px-4 py-2 text-sm font-bold transition-colors",
              i === current ? "text-primary" : "text-navy/70 hover:text-navy",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

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
          className="inline-flex size-11 items-center justify-center rounded-full text-navy transition-colors hover:bg-accent lg:hidden"
        >
          <Menu className="size-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-background data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 size-80 rounded-full bg-mint/25 blur-3xl" />
            <div className="absolute bottom-10 -left-24 size-80 rounded-full bg-primary/15 blur-3xl" />
          </div>
          <div className="flex h-16 items-center justify-between px-5">
            <Dialog.Title className="sr-only">Menu</Dialog.Title>
            <img src={logo.url} alt="Poux Chrono 31" className="h-10 w-auto" />
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Fermer le menu"
                className="inline-flex size-11 items-center justify-center rounded-full bg-white text-navy shadow-soft"
              >
                <X className="size-6" />
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Navigation mobile" className="flex flex-1 flex-col justify-center px-6 py-6">
            {nav.map((item, i) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "group flex items-center justify-between border-b border-border/70 py-4 font-display text-[clamp(1.75rem,8vw,2.5rem)] font-semibold tracking-tight animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500",
                  i === current ? "text-primary" : "text-navy",
                )}
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-sans text-xs font-bold text-mint-ink tabular-nums">
                    0{i + 1}
                  </span>
                  {item.label}
                </span>
                <ArrowRight className="size-6 opacity-30 transition-[opacity,transform] group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          <div
            className="grid gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-500"
            style={{ animationDelay: "420ms" }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" size="lg">
                <a href={site.phoneHref}>
                  <Phone /> Appeler
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={site.whatsappHref} target="_blank" rel="noreferrer">
                  <MessageCircle className="text-mint-ink" /> WhatsApp
                </a>
              </Button>
            </div>
            <Button asChild variant="cta" size="lg">
              <Link to="/contact" search={{}} onClick={() => onOpenChange(false)}>
                Prendre rendez-vous
                <ArrowRight data-arrow />
              </Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {site.phoneDisplay} · {site.horaires}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
