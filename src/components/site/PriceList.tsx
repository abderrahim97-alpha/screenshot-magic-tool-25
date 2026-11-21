import { Clock } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { tarifs } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Elegant price list for dark (navy) sections. */
export function PriceList({ className }: { className?: string | undefined }) {
  return (
    <ul
      className={cn(
        "glass-dark divide-y divide-white/10 overflow-hidden rounded-[1.75rem] md:rounded-[2rem]",
        className,
      )}
    >
      {tarifs.map((t, i) => (
        <Reveal
          as="li"
          key={t.type}
          delay={i * 80}
          className="group flex items-center gap-4 px-5 py-5 transition-colors hover:bg-white/[0.04] sm:gap-6 md:px-8 md:py-6"
        >
          <span
            aria-hidden="true"
            className="hidden font-display text-sm font-semibold text-white/30 tabular-nums sm:block"
          >
            0{i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold text-white md:text-xl">{t.type}</p>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/60">
              <span>{t.detail}</span>
              <span className="inline-flex items-center gap-1 text-white/45">
                <Clock className="size-3.5" aria-hidden="true" />
                Environ {t.duree}
              </span>
            </p>
          </div>
          <span
            aria-hidden="true"
            className="hidden h-px flex-1 border-t border-dashed border-white/15 lg:block"
          />
          <p className="shrink-0 text-right font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            {t.prix.startsWith("à partir de") ? (
              <>
                <span className="block text-xs font-sans font-semibold tracking-normal text-mint">
                  à partir de
                </span>
                {t.prix.replace("à partir de ", "")}
              </>
            ) : (
              t.prix
            )}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}
