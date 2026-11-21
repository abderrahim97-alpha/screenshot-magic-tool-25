import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import logo from "@/assets/logo.png.asset.json";
import { HairStrand } from "@/components/site/Strand";
import { site, villes } from "@/lib/site";

const links = [
  { to: "/services", label: "Nos services" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/blog", label: "Blog" },
] as const;

export function Footer() {
  return (
    <footer className="grain relative mt-20 overflow-hidden bg-navy text-white md:mt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-48 left-1/4 size-[36rem] rounded-full bg-primary/35 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 size-[24rem] rounded-full bg-mint/15 blur-[100px]" />
      </div>

      <div className="section-x grid gap-12 pt-16 pb-10 md:pt-20 lg:grid-cols-[1.25fr_1fr_0.8fr_1.3fr] lg:gap-10">
        <div>
          <div className="inline-flex rounded-3xl bg-white p-4 shadow-card">
            <img src={logo.url} alt="Poux Chrono 31" className="h-14 w-auto md:h-16" />
          </div>
          <p className="mt-6 max-w-xs text-white/70">{site.slogan}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-mint/15 px-3.5 py-1.5 text-sm font-bold text-mint ring-1 ring-mint/25">
            <ShieldCheck className="size-4" /> Intervention sous 24h
          </div>
        </div>

        <div>
          <h3 className="font-sans text-xs font-bold tracking-[0.18em] text-white/50 uppercase">
            Nous joindre
          </h3>
          <ul className="mt-5 space-y-1 text-sm">
            <li>
              <a
                href={site.phoneHref}
                className="flex min-h-11 items-center gap-3 font-display text-xl font-semibold text-white transition-colors hover:text-mint"
              >
                <Phone className="size-5 text-mint" /> {site.phoneDisplay}
              </a>
            </li>
            <li className="flex min-h-11 items-center gap-3 text-white/70">
              <Mail className="size-4 shrink-0 text-white/40" /> {site.email}
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
          <h3 className="font-sans text-xs font-bold tracking-[0.18em] text-white/50 uppercase">
            Le site
          </h3>
          <ul className="mt-5 space-y-1 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="flex min-h-11 items-center text-white/75 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                search={{}}
                className="flex min-h-11 items-center text-white/75 transition-colors hover:text-white"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-bold tracking-[0.18em] text-white/50 uppercase">
            Zone d'intervention
          </h3>
          <ul className="mt-5 flex flex-wrap gap-2">
            {villes.map((v) => (
              <li
                key={v}
                className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs font-semibold text-white/80 ring-1 ring-white/10"
              >
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-x">
        <HairStrand className="h-3 w-full text-white/15" waves={14} amplitude={4} strokeWidth={1.5} />
        <div className="flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Poux Chrono 31 — Tous droits réservés</p>
          <p>Mentions légales • CGV • Politique de confidentialité</p>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] text-center font-display text-[clamp(3.5rem,15.5vw,15rem)] leading-none font-extrabold tracking-[-0.05em] whitespace-nowrap text-white/[0.05]">
          Poux Chrono 31
        </p>
      </div>
    </footer>
  );
}
