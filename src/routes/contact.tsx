import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Check,
  CircleCheck,
  Clock,
  Home,
  Info,
  Leaf,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";

import { PageHeader } from "@/components/site/Bits";
import { Pill, StarRating } from "@/components/site/Kit";
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
const stepIcons: LucideIcon[] = [MapPin, Users, UserRound];
const quandOptions = ["Dès que possible", "Aujourd'hui", "Demain", "Cette semaine"];
const serviceIcons: Record<string, LucideIcon> = {
  "traitement-domicile": Home,
  "diagnostic-depistage": Search,
  collectivite: Users,
};

/* ============================================================= Helpers */

function spotlight(e: ReactPointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Spot({ color = "rgb(31 79 176 / 0.10)" }: { color?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-[1] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
      style={{
        background: `radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 45%)`,
      }}
    />
  );
}

/* ================================================================ Page */

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

  /** Allow jumping back to a finished step from the progress bar. */
  const jump = (i: number) => {
    if (i < step) goTo(i);
    else if (i === step + 1) next();
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
    // TODO: brancher l'envoi (server fn / email)
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const townLabel = isOtherTown ? "Autre commune" : selectedTown;

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Contact" }]}
        highlight="dans la journée"
        eyebrow="Contact"
        titre="On vous rappelle dans la journée"
        intro="Laissez-nous quelques infos, ou appelez directement : on trouve ensemble le créneau qui vous arrange."
      />

      <QuickActions />

      <section className="relative isolate pt-8 pb-16 md:pt-12 md:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="pc-aurora absolute top-20 -left-40 size-[30rem] rounded-full bg-accent/70 blur-3xl" />
          <div className="pc-aurora absolute right-[-10rem] bottom-0 size-[28rem] rounded-full bg-mint-soft/70 blur-3xl [animation-delay:-8s]" />
        </div>

        <div className="section-x grid items-start gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
          <Reveal load delay={150} className="min-w-0">
            <div
              ref={cardRef}
              className="relative overflow-hidden rounded-[2.25rem] bg-white p-5 shadow-card ring-1 ring-border/60 sm:p-8 md:p-10"
            >
              {/* top accent */}
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-mint to-primary" />

              {sent ? (
                <SuccessState
                  onReset={() => {
                    setSent(false);
                    setStep(0);
                  }}
                />
              ) : (
                <>
                  <Progress step={step} onJump={jump} />

                  {/* Live summary */}
                  <Summary
                    town={townLabel}
                    fee={travelFee ? feeFormValue : ""}
                    service={step >= 1 ? service : ""}
                    people={step >= 1 ? people : 0}
                    quand={step >= 1 ? quand : ""}
                  />

                  <form onSubmit={onSubmit} noValidate className="mt-8">
                    {/* Step 1 — Où ? */}
                    <div
                      ref={(el) => {
                        stepRefs.current[0] = el;
                      }}
                      hidden={step !== 0}
                      className="grid gap-5 animate-in fade-in slide-in-from-right-4 duration-500"
                    >
                      <StepTitle icon={MapPin} index={0} />
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
                        <Input id="adresse" name="adresse" required maxLength={200} autoComplete="street-address" />
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
                      <StepTitle icon={Users} index={1} />
                      <fieldset id="service" className="min-w-0">
                        <legend className="text-sm font-medium">Service souhaité</legend>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {services.map((s) => {
                            const Icon = serviceIcons[s.slug] ?? Home;
                            const checked = service === s.titre;
                            return (
                              <label
                                key={s.slug}
                                onPointerMove={spotlight}
                                className={cn(
                                  "group/spot relative isolate flex cursor-pointer flex-col gap-3 overflow-hidden rounded-2xl border-2 p-4 transition-[border-color,background-color,box-shadow,transform] duration-300 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20",
                                  checked
                                    ? "-translate-y-0.5 border-primary bg-accent/60 shadow-card"
                                    : "border-border bg-white hover:-translate-y-0.5 hover:border-primary/30",
                                )}
                              >
                                <Spot />
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
                                      "inline-flex size-11 items-center justify-center rounded-xl transition-all duration-300",
                                      checked ? "scale-105 bg-primary text-white" : "bg-accent text-primary",
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
                                <span className="mt-auto inline-flex w-fit rounded-full bg-white px-2.5 py-1 text-xs font-bold text-primary ring-1 ring-primary/15">
                                  {s.prix}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>

                      <div className="grid gap-7 rounded-2xl bg-secondary/50 p-4 sm:grid-cols-[auto_1fr] sm:gap-10 sm:p-5">
                        <div className="grid content-start gap-3">
                          <Label id="personnes-label" htmlFor="personnes">
                            Nombre de personnes
                          </Label>
                          <Stepper inputId="personnes" labelledBy="personnes-label" value={people} onChange={setPeople} />
                        </div>
                        <fieldset id="quand" className="min-w-0">
                          <legend className="text-sm font-medium">Quand ?</legend>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {quandOptions.map((q) => (
                              <label
                                key={q}
                                className={cn(
                                  "inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-bold transition-all duration-300 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20",
                                  quand === q
                                    ? "border-navy bg-navy text-white shadow-soft"
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
                                {quand === q && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
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
                      <div className="sm:col-span-2">
                        <StepTitle icon={UserRound} index={2} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nom">Nom et prénom</Label>
                        <Input id="nom" name="nom" required maxLength={100} autoComplete="name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="tel">Téléphone</Label>
                        <Input id="tel" name="tel" type="tel" required maxLength={20} autoComplete="tel" />
                      </div>
                      <div className="grid gap-2 sm:col-span-2">
                        <Label htmlFor="message">Message (facultatif)</Label>
                        <Textarea id="message" name="message" rows={4} maxLength={1000} />
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
                        <Button type="submit" variant="cta" size="lg" className="pc-shine relative overflow-hidden">
                          Envoyer ma demande
                          <ArrowRight data-arrow />
                        </Button>
                      )}
                    </div>
                    <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
                      <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                      Vos informations restent confidentielles et servent uniquement à vous recontacter.
                    </p>
                  </form>
                </>
              )}
            </div>
          </Reveal>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-28">
            <TrustCard />
            <ContactCard />
          </aside>
        </div>
      </section>
    </>
  );
}

/* ======================================================= Quick actions */

function QuickActions() {
  const actions: { icon: LucideIcon; label: string; value: string; href: string; tone: string; external?: boolean }[] = [
    { icon: Phone, label: "Téléphone", value: site.phoneDisplay, href: site.phoneHref, tone: "bg-primary text-white" },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Écrivez-nous",
      href: site.whatsappHref,
      tone: "bg-mint text-white",
      external: true,
    },
    { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}`, tone: "bg-navy text-white" },
  ];

  return (
    <div className="section-x relative z-10 -mt-6 md:-mt-10">
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {actions.map((a, i) => (
          <Reveal key={a.label} load delay={80 + i * 80}>
            <a
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noreferrer" } : {})}
              onPointerMove={spotlight}
              className="group/spot relative isolate flex h-full flex-col items-center gap-2 overflow-hidden rounded-[1.5rem] bg-white p-3 text-center shadow-card ring-1 ring-border/60 transition-transform duration-500 hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none sm:flex-row sm:gap-4 sm:p-4 sm:text-left"
            >
              <Spot />
              <span
                className={cn(
                  "inline-flex size-11 shrink-0 items-center justify-center rounded-2xl shadow-soft transition-transform duration-500 group-hover/spot:-rotate-6 group-hover/spot:scale-110 sm:size-12",
                  a.tone,
                )}
              >
                <a.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-navy sm:text-sm sm:font-normal sm:text-muted-foreground">
                  {a.label}
                </span>
                <span className="hidden truncate font-display text-base font-semibold text-navy sm:block">{a.value}</span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="hidden size-5 shrink-0 text-navy/30 transition-all duration-300 group-hover/spot:translate-x-0.5 group-hover/spot:-translate-y-0.5 group-hover/spot:text-primary sm:block"
              />
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ Progress */

function Progress({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
        <span className="tracking-[0.18em] uppercase">
          Étape {step + 1} / {steps.length}
        </span>
        <span className="text-navy">{steps[step]}</span>
      </div>

      <ol className="relative mt-5 grid grid-cols-3">
        {/* track */}
        <span aria-hidden="true" className="absolute top-5 right-[16.66%] left-[16.66%] h-1 rounded-full bg-accent" />
        <span
          aria-hidden="true"
          className="absolute top-5 left-[16.66%] h-1 rounded-full bg-gradient-to-r from-primary to-mint transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ width: `${(step / (steps.length - 1)) * 66.66}%` }}
        />
        {steps.map((label, i) => {
          const Icon = stepIcons[i] ?? MapPin;
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} aria-current={current ? "step" : undefined} className="relative flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => onJump(i)}
                disabled={i > step + 1}
                aria-label={label}
                className={cn(
                  "relative inline-flex size-11 cursor-pointer items-center justify-center rounded-full transition-all duration-500 disabled:cursor-default",
                  done && "bg-mint-ink text-white",
                  current && "scale-110 bg-primary text-white shadow-card ring-4 ring-primary/15",
                  !done && !current && "bg-white text-muted-foreground ring-1 ring-border",
                )}
              >
                {done ? <Check className="size-5" strokeWidth={3} /> : <Icon className="size-5" />}
              </button>
              <span
                className={cn(
                  "text-center text-xs font-bold transition-colors sm:text-sm",
                  i <= step ? "text-navy" : "text-muted-foreground/60",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepTitle({ icon: Icon, index }: { icon: LucideIcon; index: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h2 className="font-display text-xl font-semibold text-navy md:text-2xl">{steps[index]}</h2>
    </div>
  );
}

/* ============================================================= Summary */

function Summary({
  town,
  fee,
  service,
  people,
  quand,
}: {
  town: string;
  fee: string;
  service: string;
  people: number;
  quand: string;
}) {
  const chips: { icon: LucideIcon; text: string }[] = [];
  if (town) chips.push({ icon: MapPin, text: fee ? `${town} · ${fee}` : town });
  if (service) chips.push({ icon: serviceIcons[services.find((s) => s.titre === service)?.slug ?? ""] ?? Home, text: service });
  if (people) chips.push({ icon: Users, text: `${people} ${people > 1 ? "personnes" : "personne"}` });
  if (quand) chips.push({ icon: CalendarClock, text: quand });

  if (chips.length === 0) return null;

  return (
    <ul aria-label="Votre demande" className="mt-6 flex flex-wrap gap-2">
      {chips.map((c) => (
        <li
          key={c.text}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-1.5 text-xs font-bold text-navy ring-1 ring-border/60 animate-in fade-in zoom-in-95 duration-300"
        >
          <c.icon className="size-3.5 text-primary" aria-hidden="true" />
          {c.text}
        </li>
      ))}
    </ul>
  );
}

/* ============================================================= Success */

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="relative py-10 text-center animate-in fade-in zoom-in-95 duration-500" role="status">
      {/* soft confetti dots */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[
          ["12%", "18%", "bg-mint"],
          ["85%", "14%", "bg-primary"],
          ["20%", "70%", "bg-star"],
          ["78%", "62%", "bg-destructive"],
          ["50%", "6%", "bg-mint"],
          ["92%", "40%", "bg-star"],
          ["6%", "44%", "bg-primary"],
        ].map(([l, t, c], i) => (
          <span
            key={i}
            className={cn("absolute size-2.5 animate-float rounded-full opacity-70", c)}
            style={{ left: l, top: t, animationDelay: `${-i * 0.7}s` }}
          />
        ))}
      </div>

      <svg viewBox="0 0 64 64" className="relative mx-auto size-24" aria-hidden="true">
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
      <h2 className="relative mt-6 text-display-md text-navy">Merci, c'est bien reçu !</h2>
      <p className="relative mx-auto mt-3 max-w-sm text-lg text-muted-foreground">
        On vous rappelle très vite. Pour une urgence, appelez le {site.phoneDisplay}.
      </p>
      <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild variant="cta" size="lg">
          <a href={site.phoneHref}>
            <Phone /> {site.phoneDisplay}
          </a>
        </Button>
        <Button variant="outline" size="lg" onClick={onReset}>
          Envoyer une autre demande
        </Button>
      </div>
    </div>
  );
}

/* ========================================================== Side cards */

function TrustCard() {
  return (
    <Reveal load delay={200}>
      <div className="relative overflow-hidden rounded-[2rem] bg-white p-5 shadow-card ring-1 ring-border/60 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <Pill live tone="mint">
            Disponible aujourd'hui
          </Pill>
          <div className="flex items-center gap-1.5">
            <StarRating />
            <span className="font-display font-bold text-navy">4,9/5</span>
          </div>
        </div>
        <ul className="mt-5 grid gap-2.5">
          {[
            { icon: Home, label: "Intervention à domicile", tone: "bg-accent text-primary" },
            { icon: Leaf, label: "Produits 100 % naturels", tone: "bg-mint-soft text-mint-ink" },
            { icon: CalendarClock, label: "Disponible 7j/7", tone: "bg-accent text-primary" },
          ].map(({ icon: Icon, label, tone }) => (
            <li key={label} className="flex items-center gap-3 text-sm font-semibold text-navy">
              <span className={cn("inline-flex size-8 items-center justify-center rounded-full", tone)}>
                <Icon className="size-4" aria-hidden="true" />
              </span>
              {label}
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-border/70 pt-4 text-sm text-muted-foreground">
          <span className="font-display text-lg font-bold text-navy">+2000</span> familles accompagnées
        </p>
      </div>
    </Reveal>
  );
}

function ContactCard() {
  const rows: { icon: LucideIcon; label: string; value: string; href?: string; external?: boolean }[] = [
    { icon: Phone, label: "Téléphone", value: site.phoneDisplay, href: site.phoneHref },
    { icon: MessageCircle, label: "WhatsApp", value: "Écrivez-nous", href: site.whatsappHref, external: true },
    { icon: Mail, label: "E-mail", value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: "Horaires", value: site.horaires },
    { icon: MapPin, label: "Zone", value: site.zone },
  ];

  return (
    <Reveal load delay={280}>
      <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-navy p-3 text-white shadow-card">
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
                    "inline-flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
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
                  <div className="flex min-h-[4.5rem] items-center gap-4 rounded-[1.4rem] px-4 py-3">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}