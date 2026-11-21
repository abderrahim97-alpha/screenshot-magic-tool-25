/**
 * Illustration lookup.
 *
 * New illustrations are dropped into `src/assets/` with fixed file names. Until a file
 * exists, the closest existing image is used as a temporary fallback, so the build never
 * breaks. Once the real file is added, it is picked up automatically on the next build.
 */
const files = import.meta.glob<string>("../assets/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

function pick(name: string, fallback: string): string {
  return files[`../assets/${name}`] ?? files[`../assets/${fallback}`] ?? "";
}

export function hasAsset(name: string) {
  return `../assets/${name}` in files;
}

export const images = {
  hero: pick("hero-famille.jpg", "hero-famille.jpg"),
  services: {
    "traitement-domicile": pick("service-domicile.jpg", "service-domicile.jpg"),
    "diagnostic-depistage": pick("service-depistage.jpg", "service-depistage.jpg"),
    collectivite: pick("service-collectivite.jpg", "service-collectivite.jpg"),
  } as Record<string, string>,
  etapes: [
    pick("etape-1-appel.jpg", "hero-famille.jpg"),
    pick("etape-2-rdv.jpg", "service-domicile.jpg"),
    pick("etape-3-traitement.jpg", "service-depistage.jpg"),
    pick("etape-4-conseils.jpg", "blog-prevention.jpg"),
  ],
  illustration404: hasAsset("illustration-404.jpg") ? pick("illustration-404.jpg", "") : null,
};
