import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { fieldClass } from "@/components/ui/input";
import { tarifs } from "@/lib/site";
import { getFamilyDiscount, getTravelFee, travelTownGroups } from "@/lib/travel-fees";
import { cn } from "@/lib/utils";

const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;
const priceOf = (prix: string) => Number(prix.match(/\d+/)?.[0] ?? 0);

/** Small interactive estimate built only on the shared pricing helpers. */
export function PriceEstimator() {
  const id = useId();
  const [hair, setHair] = useState(0);
  const [people, setPeople] = useState(1);
  const [town, setTown] = useState("");

  const tarif = tarifs[hair] ?? tarifs[0]!;
  const unit = priceOf(tarif.prix);
  const isFrom = tarif.prix.startsWith("à partir de");
  const discount = getFamilyDiscount({ peopleCount: people, sameDay: true, sameAddress: true });
  const fee = getTravelFee(town === "other" ? "other" : town);
  const total = unit * people - discount + (fee?.amount ?? 0);

  return (
    <div className="grid gap-8 rounded-[2rem] border border-border/70 bg-white p-6 shadow-card md:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
      <div className="space-y-7">
        <fieldset>
          <legend className="text-sm font-bold text-navy">Longueur des cheveux</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {tarifs.map((t, i) => (
              <label
                key={t.type}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-primary/20",
                  i === hair
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-navy hover:border-primary/40",
                )}
              >
                <input
                  type="radio"
                  name={`${id}-hair`}
                  className="sr-only"
                  checked={i === hair}
                  onChange={() => setHair(i)}
                />
                {t.type}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p id={`${id}-people`} className="text-sm font-bold text-navy">
              Nombre de personnes
            </p>
            <Stepper
              labelledBy={`${id}-people`}
              value={people}
              onChange={setPeople}
              className="mt-3"
            />
          </div>
          <div>
            <label htmlFor={`${id}-town`} className="block text-sm font-bold text-navy">
              Commune
            </label>
            <select
              id={`${id}-town`}
              className={cn(fieldClass, "mt-3")}
              value={town}
              onChange={(e) => setTown(e.target.value)}
            >
              <option value="">Choisissez une commune</option>
              {travelTownGroups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.towns.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="other">Autre commune</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-[1.5rem] bg-navy p-6 text-white md:p-7" aria-live="polite">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-white/70">
              {people} × {tarif.type}
            </dt>
            <dd className="font-semibold">{euro(unit * people)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex justify-between gap-4">
              <dt className="text-white/70">Tarif famille</dt>
              <dd className="font-semibold text-mint">− {euro(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-white/70">{fee ? fee.label.split(" : ")[0] : "Frais de déplacement"}</dt>
            <dd className="font-semibold">
              {!fee ? "—" : fee.amount === null ? "sur devis" : fee.isFree ? "offerts" : euro(fee.amount)}
            </dd>
          </div>
        </dl>
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-sm text-white/60">Total estimé{isFrom && " (à partir de)"}</p>
          <p className="mt-1 font-display text-5xl font-bold tracking-tight">{euro(total)}</p>
          {fee?.amount === null && (
            <p className="mt-1 text-sm text-white/60">+ frais de déplacement sur devis</p>
          )}
        </div>
        <Button asChild variant="cta" size="lg" className="mt-7">
          <Link to="/contact" search={{}}>
            Prendre rendez-vous
            <ArrowRight data-arrow />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/** − / + number stepper (48px targets). */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 20,
  labelledBy,
  className,
  inputId,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  labelledBy?: string | undefined;
  className?: string | undefined;
  inputId?: string | undefined;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div
      className={cn(
        "inline-flex h-12 items-center gap-1 rounded-2xl border border-input bg-white p-1",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Retirer une personne"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className="inline-flex size-10 items-center justify-center rounded-xl text-navy transition-colors hover:bg-accent disabled:opacity-30"
      >
        <Minus className="size-4" />
      </button>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        aria-labelledby={labelledBy}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
        className="w-12 [appearance:textfield] bg-transparent text-center font-display text-xl font-bold text-navy focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Ajouter une personne"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="inline-flex size-10 items-center justify-center rounded-xl text-navy transition-colors hover:bg-accent disabled:opacity-30"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
