import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import logo from "@/assets/logo.png.asset.json";
import { site, villes } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/70">
      <div className="section-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={logo.url} alt="Poux Chrono 31" className="h-12 w-auto" />
          <p className="mt-4 text-sm text-muted-foreground">{site.slogan}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-mint-soft px-3 py-1.5 text-xs font-bold text-mint">
            <ShieldCheck className="size-4" /> Intervention sous 24h
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">Nous joindre</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={site.phoneHref} className="flex items-center gap-2 font-bold text-primary">
                <Phone className="size-4" /> {site.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-4" /> {site.email}
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <Clock className="size-4" /> {site.horaires}
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" /> {site.zone}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">Le site</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/services" className="hover:text-primary">
                Nos services
              </Link>
            </li>
            <li>
              <Link to="/comment-ca-marche" className="hover:text-primary">
                Comment ça marche
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-primary">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">Zone d'intervention</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{villes.join(" • ")}</p>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="section-x flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Poux Chrono 31 — Tous droits réservés</p>
          <p>Mentions légales • CGV • Politique de confidentialité</p>
        </div>
      </div>
    </footer>
  );
}
