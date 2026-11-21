import illustration404 from "@/assets/illustration-404.png";
import etape1 from "@/assets/etape-1-appel.png";
import etape2 from "@/assets/etape-2-rdv.png";
import etape3 from "@/assets/etape-3-traitement.png";
import etape4 from "@/assets/etape-4-conseils.png";
import hero from "@/assets/hero-famille.png";
import serviceCollectivite from "@/assets/service-collectivite.png";
import serviceDepistage from "@/assets/service-depistage.png";
import serviceDomicile from "@/assets/service-domicile.png";

/** Site illustrations (flat vector style, PNG). */
export const images = {
  hero,
  services: {
    "traitement-domicile": serviceDomicile,
    "diagnostic-depistage": serviceDepistage,
    collectivite: serviceCollectivite,
  } as Record<string, string>,
  etapes: [etape1, etape2, etape3, etape4],
  illustration404,
};

/** Real pixel sizes of the illustrations, for <img width/height>. */
export const imageSize = {
  hero: { width: 1374, height: 1145 },
  service: { width: 1448, height: 1086 },
  etape: { width: 1122, height: 1402 },
  blog: { width: 1586, height: 992 },
  illustration404: { width: 1254, height: 1254 },
} as const;
