import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { StarRating } from "@/components/site/Kit";
import { temoignages } from "@/lib/site";
import { cn } from "@/lib/utils";

export function TestimonialCarousel() {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const sync = useCallback(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    setSnaps(api.scrollSnapList());
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    sync();
    api.on("select", sync).on("reInit", sync);
    return () => {
      api.off("select", sync).off("reInit", sync);
    };
  }, [api, sync]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Avis clients"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") api?.scrollPrev();
        if (e.key === "ArrowRight") api?.scrollNext();
      }}
    >
      <div ref={viewportRef} className="-mx-5 overflow-hidden px-5 md:mx-0 md:px-0">
        <div className="-ml-4 flex touch-pan-y">
          {temoignages.map((t) => (
            <div
              key={t.prenom}
              role="group"
              aria-roledescription="slide"
              className="min-w-0 shrink-0 grow-0 basis-[88%] pl-4 sm:basis-[62%] lg:basis-1/2"
            >
              <figure className="flex h-full flex-col rounded-[1.75rem] bg-white p-7 shadow-soft ring-1 ring-navy/5 md:p-8">
                <div className="flex items-center justify-between">
                  <StarRating />
                  <Quote className="size-8 text-mint/40" aria-hidden="true" />
                </div>
                <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-navy/85">
                  {t.texte}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3 border-t border-border/70 pt-5">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-mint-soft font-display text-sm font-bold text-primary"
                  >
                    {t.prenom.slice(0, 2).toUpperCase()}
                  </span>
                  <span>
                    <span className="block font-bold text-navy">{t.prenom}</span>
                    <span className="block text-sm text-muted-foreground">{t.ville}</span>
                  </span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex gap-1.5">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Aller à l'avis ${i + 1}`}
              aria-current={i === selected}
              onClick={() => api?.scrollTo(i)}
              className="flex h-11 items-center px-0.5"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-[width,background-color] duration-500",
                  i === selected ? "w-8 bg-primary" : "w-2 bg-navy/20",
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Avis précédent"
            onClick={() => api?.scrollPrev()}
            disabled={!canPrev}
            className="inline-flex size-12 items-center justify-center rounded-full bg-white text-navy shadow-soft ring-1 ring-navy/10 transition-[opacity,transform] hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Avis suivant"
            onClick={() => api?.scrollNext()}
            disabled={!canNext}
            className="inline-flex size-12 items-center justify-center rounded-full bg-navy text-white shadow-soft transition-[opacity,transform] hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
