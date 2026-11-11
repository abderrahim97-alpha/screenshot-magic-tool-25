import { createFileRoute, useLocation } from "@tanstack/react-router";
import { CheckCircle2, CircleCheck, Clock, Info, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Breadcrumb, PageHeader } from "@/components/site/Bits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services, site } from "@/lib/site";
import { getTravelFee, travelTownGroups } from "@/lib/travel-fees";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & rendez-vous — Poux Chrono 31 Toulouse" },
      {
        name: "description",
        content:
          "Prenez rendez-vous pour un traitement des poux à domicile à Toulouse et en Haute-Garonne. Réponse rapide, intervention souvent le jour même.",
      },
      { property: "og:title", content: "Prendre rendez-vous — Poux Chrono 31" },
      {
        property: "og:description",
        content: "Réponse rapide, intervention souvent le jour même à Toulouse.",
      },
    ],
  }),
  component: ContactPage,
});

const selectClass =
  "flex h-11 w-full rounded-xl border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ContactPage() {
  const location = useLocation();
  const requestedService = new URLSearchParams(location.search).get("service");
  const defaultService = services.find((service) => service.slug === requestedService)?.slug;
  const [sent, setSent] = useState(false);
  const [selectedTown, setSelectedTown] = useState("");
  const isOtherTown = selectedTown === "other";
  const travelFee = getTravelFee(isOtherTown ? "other" : selectedTown);
  const feeFormValue = travelFee
    ? travelFee.amount === null
      ? "sur devis"
      : travelFee.amount === 0
        ? "offerts"
        : `${travelFee.amount} €`
    : "À déterminer";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Contact" }]} />
      <PageHeader
        eyebrow="Contact"
        titre="On vous rappelle dans la journée"
        intro="Laissez-nous quelques infos, ou appelez directement : on trouve ensemble le créneau qui vous arrange."
      />
      <section className="section-x grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl bg-card p-6 shadow-card md:p-8">
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto size-14 text-mint" />
              <h2 className="mt-4 text-2xl">Merci, c'est bien reçu !</h2>
              <p className="mt-2 text-muted-foreground">
                On vous rappelle très vite. Pour une urgence, appelez le {site.phoneDisplay}.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                Envoyer une autre demande
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom et prénom</Label>
                <Input id="nom" required maxLength={100} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tel">Téléphone</Label>
                <Input id="tel" type="tel" required maxLength={20} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="commune">Commune</Label>
                <select
                  id="commune"
                  name="commune"
                  className={selectClass}
                  value={selectedTown}
                  onChange={(event) => setSelectedTown(event.target.value)}
                  required
                >
                  <option value="">Choisissez une commune</option>
                  {travelTownGroups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.towns.map((town) => (
                        <option key={town} value={town}>{town}</option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="other">Autre commune</option>
                </select>
                {travelFee && (
                  <p className="flex items-center gap-2 text-sm font-semibold text-primary" role="status">
                    {travelFee.isFree ? (
                      <CircleCheck className="size-4 text-mint" aria-hidden="true" />
                    ) : (
                      <Info className="size-4 text-primary" aria-hidden="true" />
                    )}
                    {travelFee.label}
                  </p>
                )}
              </div>
              {isOtherTown && (
                <div className="grid gap-2">
                  <Label htmlFor="autre-commune">Nom de la commune</Label>
                  <Input id="autre-commune" name="autreCommune" required maxLength={100} />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="adresse">Adresse</Label>
                <Input id="adresse" name="adresse" required maxLength={200} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service">Service souhaité</Label>
                  <select
                    id="service"
                    name="service"
                    className={selectClass}
                    defaultValue={defaultService ?? services[0]?.slug}
                  >
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.titre}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="personnes">Nombre de personnes</Label>
                <Input id="personnes" type="number" min={1} max={20} defaultValue={1} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quand">Quand ?</Label>
                <select id="quand" className={selectClass}>
                  <option>Dès que possible</option>
                  <option>Aujourd'hui</option>
                  <option>Demain</option>
                  <option>Cette semaine</option>
                </select>
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="message">Message (facultatif)</Label>
                <Textarea id="message" rows={4} maxLength={1000} />
              </div>
              <Button type="submit" variant="cta" size="lg" className="sm:col-span-2">
                Envoyer ma demande
              </Button>
              <input type="hidden" name="fraisDeplacement" value={feeFormValue} />
              <p className="text-xs text-muted-foreground sm:col-span-2">
                Vos informations restent confidentielles et servent uniquement à vous recontacter.
              </p>
            </form>
          )}
        </div>
        <aside className="space-y-4">
          {[
            { icon: Phone, label: "Téléphone", value: site.phoneDisplay, href: site.phoneHref },
            { icon: MessageCircle, label: "WhatsApp", value: "Écrivez-nous", href: site.whatsappHref },
            { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}` },
            { icon: Clock, label: "Horaires", value: site.horaires },
            { icon: MapPin, label: "Zone", value: site.zone },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft">
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                <c.icon className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="font-bold text-primary hover:underline">
                    {c.value}
                  </a>
                ) : (
                  <p className="font-bold">{c.value}</p>
                )}
              </div>
            </div>
          ))}
        </aside>
      </section>
    </>
  );
}
