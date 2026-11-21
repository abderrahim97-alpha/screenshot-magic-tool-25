import { Link } from "@tanstack/react-router";
import {
  ArrowUp,
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  type LucideIcon,
} from "lucide-react";

import logo from "@/assets/poux-chrono-31-logo.webp";
import { HairStrand } from "@/components/site/Strand";
import { site, villes } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Nos services" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/blog", label: "Blog" },
] as const;

export function Footer() {
  const contacts: { icon: LucideIcon; label: string; value: string; href: string; tone: string; external?: boolean }[] = [
    { icon: Phone, label: "Téléphone", value: site.phoneDisplay, href: site.phoneHref, tone: "bg-primary" },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Écrivez-nous",
      href: site.whatsappHref,
      tone: "bg-mint",
      external: true,
    },
    { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}`, tone: "bg-white/15" },
  ];

  return (
    <footer className="grain relative isolate mt-20 overflow-hidden bg-navy text-white md:mt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="pc-aurora absolute -top-48 left-1/4 size-[36rem] rounded-full bg-primary/35 blur-[120px]" />
        <div className="pc-aurora absolute top-1/3 -right-40 size-[24rem] rounded-full bg-mint/15 blur-[100px] [animation-delay:-8s]" />
        <div className="absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(black,transparent_70%)]" />
      </div>

      {/* ---------- Contact tiles */}
      <div className="section-x pt-14 md:pt-20">
        <div className="grid gap-3 sm:grid-cols-3 md:gap-4">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-[1.5rem] bg-white/[0.06] p-4 ring-1 ring-white/10 backdrop-blur transition-[background-color,transform] duration-500 hover:-translate-y-1 hover:bg-white/[0.1] md:p-5"
            >
              <span
                className={cn(
                  "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-soft transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110",
                  c.tone,
                )}
              >
                <c.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-white/55">{c.label}</span>
                <span className="block truncate font-display text-lg font-semibold">{c.value}</span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-5 shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
              />
            </a>
          ))}
        </div>
      </div>

      {/* ---------- Columns */}
      <div className="section-x grid gap-12 pt-14 pb-10 md:pt-16 lg:grid-cols-[1.3fr_0.8fr_1fr_1.4fr] lg:gap-10">
        <div>
          <div className="inline-flex rounded-3xl bg-white p-4 shadow-card">
            <img src={logo} alt="Poux Chrono 31" className="h-14 w-auto md:h-16" />
          </div>
          <p className="mt-6 max-w-xs text-white/70">{site.slogan}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-mint/15 px-3.5 py-1.5 text-sm font-bold text-mint ring-1 ring-mint/25">
              <ShieldCheck className="size-4" /> Intervention sous 24h
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3.5 py-1.5 text-sm font-bold text-white/85 ring-1 ring-white/10">
              <Star className="size-4 fill-star text-star" /> 4,9/5
            </span>
          </div>
        </div>

        <nav aria-label="Pied de page">
          <p className="text-xs font-bold tracking-[0.18em] text-white/50 uppercase">Le site</p>
          <ul className="mt-5 space-y-0.5 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group flex min-h-11 items-center gap-2 text-white/75 transition-colors hover:text-white"
                >
                  <span className="h-px w-0 bg-mint transition-all duration-300 group-hover:w-4" aria-hidden="true" />
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                search={{}}
                className="group flex min-h-11 items-center gap-2 text-white/75 transition-colors hover:text-white"
              >
                <span className="h-px w-0 bg-mint transition-all duration-300 group-hover:w-4" aria-hidden="true" />
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-white/50 uppercase">Nous joindre</p>
          <ul className="mt-5 space-y-1 text-sm">
            <li>
              <a
                href={site.phoneHref}
                className="flex min-h-11 items-center gap-3 font-display text-xl font-semibold text-white transition-colors hover:text-mint"
              >
                <Phone className="size-5 text-mint" /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex min-h-11 items-center gap-3 text-white/70 transition-colors hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-white/40" /> {site.email}
              </a>
            </li>
            <li className="flex min-h-11 items-center gap-3 text-white/70">
              <Clock className="size-4 shrink-0 text-white/40" /> {site.horaires}
            </li>
            <li className="flex min-h-11 items-center gap-3 text-white/70">
              <MapPin className="size-4 shrink-0 text-white/40" /> {site.zone}
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-white/50 uppercase">Zone d'intervention</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {villes.map((v) => (
              <li
                key={v}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-white/80 ring-1 ring-white/10 transition-colors hover:bg-white/[0.12] hover:text-white"
              >
                <span className="size-1.5 rounded-full bg-mint" aria-hidden="true" />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- Bottom bar */}
      <div className="section-x">
        <HairStrand className="h-3 w-full text-white/15" waves={14} amplitude={4} strokeWidth={1.5} />
        <div className="flex flex-col gap-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Poux Chrono 31 — Tous droits réservés</p>
          <div className="flex items-center gap-4">
            <p>Mentions légales • CGV • Politique de confidentialité</p>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              aria-label="Haut de page"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-[background-color,transform] duration-300 hover:-translate-y-1 hover:bg-mint hover:text-navy"
            >
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {/* ---------- Wordmark — SVG so it always fits the exact width */}
      <div aria-hidden="true" className="pointer-events-none section-x select-none">
        <svg viewBox="0 0 1000 150" className="block h-auto w-full" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <text
            x="500"
            y="138"
            textAnchor="middle"
            textLength="990"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#footer-wordmark)"
            className="font-display"
            style={{ fontSize: 170, fontWeight: 800, letterSpacing: "-0.04em" }}
          >
            Poux Chrono 31
          </text>
        </svg>
      </div>
    </footer>
  );
}