import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  Clock,
  Home,
  Info,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { PageHeader } from "@/components/site/Bits";
import { Stepper } from "@/components/site/PriceEstimator";
import { Reveal } from "@/components/site/Reveal";
import { HairStrand } from "@/components/site/Strand";
import { Button } from "@/components/ui/button";
import { fieldClass, Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services, site } from "@/lib/site";
import { getTravelFee, travelTownGroups } from "@/lib/travel-fees";
import { cn } from "@/lib/utils";

type ContactSearch = { service?: string };

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => {
    const service = services.find((item) => item.slug === search["service"])?.slug;
    return service ? { service } : {};
  },
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

const selectClass = cn(
  fieldClass,
  "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20stroke%3D%22%2317203a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m5%208%205%205%205-5%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat pr-11",
);

const steps = ["Où ?", "Pour qui ?", "Vos coordonnées"];
const quandOptions = ["Dès que possible", "Aujourd'hui", "Demain", "Cette semaine"];
const serviceIcons: Record<string, LucideIcon> = {
  "traitement-domicile": Home,
  "diagnostic-depistage": Search,
  collectivite: Users,
};

function ContactPage() {
  const { service: defaultService } = Route.useSearch();
  const [sent, setSent] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedTown, setSelectedTown] = useState("");
  const [service, setService] = useState(
    services.find((item) => item.slug === defaultService)?.titre ?? services[0]?.titre ?? "",
  );
  const [people, setPeople] = useState(1);
  const [quand, setQuand] = useState(quandOptions[0]!);
  const cardRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isOtherTown = selectedTown === "other";
  const travelFee = getTravelFee(isOtherTown ? "other" : selectedTown);
  const feeFormValue = travelFee
    ? travelFee.amount === null
      ? "sur devis"
      : travelFee.amount === 0
        ? "offerts"
        : `${travelFee.amount} €`
    : "À déterminer";

  /** Native validation, one step at a time. */
  const stepIsValid = (i: number, report: boolean) => {
    const fields = stepRefs.current[i]?.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");
    for (const field of Array.from(fields ?? [])) {
      if (!field.checkValidity()) {
        if (report) field.reportValidity();
        return false;
      }
    }
    return true;
  };

  const goTo = (i: number) => {
    setStep(i);
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) {
      window.scrollTo({ top: window.scrollY + top - 110, behavior: "smooth" });
    }
  };

  const next = () => {
    if (stepIsValid(step, true)) goTo(Math.min(step + 1, steps.length - 1));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < steps.length - 1) {
      next();
      return;
    }
    for (let i = 0; i < steps.length; i++) {
      if (!stepIsValid(i, false)) {
        goTo(i);
        requestAnimationFrame(() => stepIsValid(i, true));
        return;
      }
    }
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Contact" }]}
        highlight="dans la journée"
        eyebrow="Contact"
        titre="On vous rappelle dans la journée"
        intro="Laissez-nous quelques infos, ou appelez directement : on trouve ensemble le créneau qui vous arrange."
      />
      <section className="section-x grid items-start gap-8 pb-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
        <Reveal load delay={150} className="min-w-0">
          <div
            ref={cardRef}
            className="rounded-[2rem] border border-border/70 bg-white p-5 shadow-card sm:p-8 md:p-10"
          >
            {sent ? (
              <SuccessState onReset={() => {
                setSent(false);
                setStep(0);
              }} />
            ) : (
              <>
                <Progress step={step} />
                <form onSubmit={onSubmit} noValidate className="mt-8">
                  {/* Step 1 — Où ? */}
                  <div
                    ref={(el) => {
                      stepRefs.current[0] = el;
                    }}
                    hidden={step !== 0}
                    className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-500"
                  >
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
                              <option key={town} value={town}>
                                {town}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                        <option value="other">Autre commune</option>
                      </select>
                      {travelFee && (
                        <p
                          className={cn(
                            "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold animate-in fade-in slide-in-from-top-1 duration-300",
                            travelFee.isFree ? "bg-mint-soft text-mint-ink" : "bg-accent text-primary",
                          )}
                          role="status"
                        >
                          {travelFee.isFree ? (
                            <CircleCheck className="size-4" aria-hidden="true" />
                          ) : (
                            <Info className="size-4" aria-hidden="true" />
                          )}
                          {travelFee.label}
                        </p>
                      )}
                    </div>
                    {isOtherTown && (
                      <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label htmlFor="autre-commune">Nom de la commune</Label>
                        <Input id="autre-commune" name="autreCommune" required maxLength={100} />
                      </div>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="adresse">Adresse</Label>
                      <Input id="adresse" name="adresse" required maxLength={200} />
                    </div>
                  </div>

                  {/* Step 2 — Pour qui ? */}
                  <div
                    ref={(el) => {
                      stepRefs.current[1] = el;
                    }}
                    hidden={step !== 1}
                    className="grid gap-7 animate-in fade-in slide-in-from-right-4 duration-500"
                  >
                    <fieldset id="service" className="min-w-0">
                      <legend className="text-sm font-medium">Service souhaité</legend>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {services.map((s) => {
                          const Icon = serviceIcons[s.slug] ?? Home;
                          const checked = service === s.titre;
                          return (
                            <label
                              key={s.slug}
                              className={cn(
                                "relative flex cursor-pointer flex-col gap-3 rounded-2xl border-2 p-4 transition-[border-color,background-color,box-shadow] duration-300 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20",
                                checked
                                  ? "border-primary bg-accent/60 shadow-soft"
                                  : "border-border bg-white hover:border-primary/30",
                              )}
                            >
                              <input
                                type="radio"
                                name="service"
                                value={s.titre}
                                checked={checked}
                                onChange={() => setService(s.titre)}
                                className="sr-only"
                              />
                              <span className="flex items-center justify-between">
                                <span
                                  className={cn(
                                    "inline-flex size-10 items-center justify-center rounded-xl transition-colors",
                                    checked ? "bg-primary text-white" : "bg-accent text-primary",
                                  )}
                                >
                                  <Icon className="size-5" aria-hidden="true" />
                                </span>
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "inline-flex size-6 items-center justify-center rounded-full border-2 transition-colors",
                                    checked ? "border-primary bg-primary text-white" : "border-border",
                                  )}
                                >
                                  {checked && <Check className="size-3.5" strokeWidth={3} />}
                                </span>
                              </span>
                              <span className="font-display text-base leading-snug font-semibold text-navy">
                                {s.titre}
                              </span>
                              <span className="text-sm font-semibold text-primary">{s.prix}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div className="grid gap-7 sm:grid-cols-[auto_1fr] sm:gap-10">
                      <div className="grid content-start gap-3">
                        <Label id="personnes-label" htmlFor="personnes">
                          Nombre de personnes
                        </Label>
                        <Stepper
                          inputId="personnes"
                          labelledBy="personnes-label"
                          value={people}
                          onChange={setPeople}
                        />
                      </div>
                      <fieldset id="quand" className="min-w-0">
                        <legend className="text-sm font-medium">Quand ?</legend>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {quandOptions.map((q) => (
                            <label
                              key={q}
                              className={cn(
                                "inline-flex h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-bold transition-colors duration-300 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20",
                                quand === q
                                  ? "border-navy bg-navy text-white"
                                  : "border-border bg-white text-navy hover:border-primary/40",
                              )}
                            >
                              <input
                                type="radio"
                                name="quand"
                                value={q}
                                checked={quand === q}
                                onChange={() => setQuand(q)}
                                className="sr-only"
                              />
                              {q}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  {/* Step 3 — Vos coordonnées */}
                  <div
                    ref={(el) => {
                      stepRefs.current[2] = el;
                    }}
                    hidden={step !== 2}
                    className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-500 sm:grid-cols-2"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="nom">Nom et prénom</Label>
                      <Input id="nom" required maxLength={100} autoComplete="name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tel">Téléphone</Label>
                      <Input id="tel" type="tel" required maxLength={20} autoComplete="tel" />
                    </div>
                    <div className="grid gap-2 sm:col-span-2">
                      <Label htmlFor="message">Message (facultatif)</Label>
                      <Textarea id="message" rows={4} maxLength={1000} />
                    </div>
                  </div>

                  <input type="hidden" name="fraisDeplacement" value={feeFormValue} />

                  <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    {step > 0 ? (
                      <Button type="button" variant="ghost" size="lg" onClick={() => goTo(step - 1)}>
                        <ArrowLeft /> Retour
                      </Button>
                    ) : (
                      <span className="hidden sm:block" />
                    )}
                    {step < steps.length - 1 ? (
                      <Button type="button" variant="default" size="lg" onClick={next}>
                        Continuer
                        <ArrowRight data-arrow />
                      </Button>
                    ) : (
                      <Button type="submit" variant="cta" size="lg">
                        Envoyer ma demande
                        <ArrowRight data-arrow />
                      </Button>
                    )}
                  </div>
                  <p className="mt-5 text-xs text-muted-foreground">
                    Vos informations restent confidentielles et servent uniquement à vous recontacter.
                  </p>
                </form>
              </>
            )}
          </div>
        </Reveal>

        <ContactCard />
      </section>
    </>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
        <span>
          {step + 1} / {steps.length}
        </span>
        <span className="text-navy">{steps[step]}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-accent">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-mint transition-[width] duration-500 ease-out"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      <ol className="mt-4 grid grid-cols-3 gap-2">
        {steps.map((label, i) => (
          <li
            key={label}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 text-sm font-bold transition-colors",
              i <= step ? "text-navy" : "text-muted-foreground/60",
            )}
          >
            <span
              className={cn(
                "inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs transition-colors",
                i < step
                  ? "bg-mint-ink text-white"
                  : i === step
                    ? "bg-primary text-white"
                    : "bg-accent text-muted-foreground",
              )}
            >
              {i < step ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span className="truncate max-sm:hidden">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="py-10 text-center animate-in fade-in zoom-in-95 duration-500" role="status">
      <svg viewBox="0 0 64 64" className="mx-auto size-24" aria-hidden="true">
        <circle cx="32" cy="32" r="30" className="fill-mint-soft" />
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="var(--color-mint-ink)"
          strokeWidth="2.5"
          pathLength={1}
          className="animate-check [animation-delay:0ms]"
          transform="rotate(-90 32 32)"
        />
        <path
          d="M20 33.5 28 41l16-17"
          fill="none"
          stroke="var(--color-mint-ink)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          className="animate-check [animation-delay:500ms]"
        />
      </svg>
      <h2 className="mt-6 text-display-md text-navy">Merci, c'est bien reçu !</h2>
      <p className="mx-auto mt-3 max-w-sm text-lg text-muted-foreground">
        On vous rappelle très vite. Pour une urgence, appelez le {site.phoneDisplay}.
      </p>
      <Button variant="outline" size="lg" className="mt-8" onClick={onReset}>
        Envoyer une autre demande
      </Button>
    </div>
  );
}

function ContactCard() {
  const rows: { icon: LucideIcon; label: string; value: string; href?: string; external?: boolean }[] =
    [
      { icon: Phone, label: "Téléphone", value: site.phoneDisplay, href: site.phoneHref },
      {
        icon: MessageCircle,
        label: "WhatsApp",
        value: "Écrivez-nous",
        href: site.whatsappHref,
        external: true,
      },
      { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}` },
      { icon: Clock, label: "Horaires", value: site.horaires },
      { icon: MapPin, label: "Zone", value: site.zone },
    ];

  return (
    <Reveal load delay={250} as="aside" className="min-w-0 lg:sticky lg:top-28">
      <div className="grain relative overflow-hidden rounded-[2rem] bg-navy p-3 text-white shadow-card">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/50 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 size-60 rounded-full bg-mint/20 blur-3xl" />
        </div>
        <HairStrand
          className="pointer-events-none absolute bottom-2 left-0 h-5 w-full text-white/10"
          waves={6}
          amplitude={6}
          strokeWidth={1.5}
        />
        <ul className="relative space-y-1.5">
          {rows.map((c) => {
            const inner = (
              <>
                <span
                  className={cn(
                    "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl",
                    c.icon === MessageCircle ? "bg-mint/20 text-mint" : "bg-white/10 text-white",
                  )}
                >
                  <c.icon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-white/55">{c.label}</span>
                  <span className="block truncate font-display text-lg font-semibold">{c.value}</span>
                </span>
                {c.href && (
                  <ArrowUpRight
                    className="size-5 shrink-0 text-white/40 transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                    aria-hidden="true"
                  />
                )}
              </>
            );
            return (
              <li key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex min-h-[4.5rem] items-center gap-4 rounded-[1.4rem] px-4 py-3 transition-colors hover:bg-white/[0.07] focus-visible:bg-white/[0.07] focus-visible:outline-none"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="flex min-h-[4.5rem] items-center gap-4 rounded-[1.4rem] px-4 py-3">
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}
