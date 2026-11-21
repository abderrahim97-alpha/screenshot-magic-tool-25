import { images, imageSize } from "@/lib/assets";
import { cn } from "@/lib/utils";

/** The "escaped louse" illustration in a rounded gradient frame (404 + missing article). */
export function NotFoundIllustration({ className }: { className?: string | undefined }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[16rem] rounded-[2.25rem] bg-gradient-to-br from-mint/40 via-white to-primary/25 p-1.5 shadow-card sm:max-w-xs md:p-2",
        className,
      )}
    >
      <img
        src={images.illustration404}
        alt=""
        width={imageSize.illustration404.width}
        height={imageSize.illustration404.height}
        className="aspect-square w-full rounded-[1.9rem] bg-gradient-to-br from-mint-soft to-accent object-cover"
      />
    </div>
  );
}
