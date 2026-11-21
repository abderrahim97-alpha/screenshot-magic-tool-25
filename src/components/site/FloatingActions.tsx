import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";

import { site } from "@/lib/site";

/** Mobile only: one floating dock — Appeler · WhatsApp · Prendre rendez-vous. */
export function MobileDock() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
      <nav
        aria-label="Actions rapides"
        className="glass pointer-events-auto mx-auto flex max-w-md items-center gap-1.5 rounded-full p-1.5 shadow-card"
      >
        <a
          href={site.phoneHref}
          className="flex h-12 min-w-0 flex-1 flex-col items-center justify-center rounded-full text-[0.7rem] font-bold text-navy transition-colors active:bg-accent"
        >
          <Phone className="size-5 text-primary" aria-hidden="true" />
          Appeler
        </a>
        <a
          href={site.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 min-w-0 flex-1 flex-col items-center justify-center rounded-full text-[0.7rem] font-bold text-navy transition-colors active:bg-mint-soft"
        >
          <MessageCircle className="size-5 text-mint-ink" aria-hidden="true" />
          WhatsApp
        </a>
        <Link
          to="/contact"
          search={{}}
          className="group flex h-12 flex-none items-center justify-center gap-1.5 rounded-full bg-destructive px-4 text-[0.8125rem] font-bold whitespace-nowrap text-white shadow-glow transition-transform active:scale-[0.98]"
        >
          Prendre rendez-vous
          <ArrowRight className="size-4 shrink-0 max-[379px]:hidden" aria-hidden="true" />
        </Link>
      </nav>
    </div>
  );
}

/** Desktop / tablet: floating WhatsApp bubble. */
export function FloatingContact() {
  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="group fixed right-6 bottom-6 z-40 hidden size-14 items-center justify-center rounded-full bg-mint-ink text-white shadow-card ring-4 ring-white/70 transition-transform duration-300 animate-in fade-in zoom-in hover:-translate-y-1 sm:inline-flex"
    >
      <span className="absolute inset-0 rounded-full bg-mint/40 animate-ping [animation-duration:2.6s] motion-reduce:hidden" />
      <MessageCircle className="relative size-6" />
    </a>
  );
}
