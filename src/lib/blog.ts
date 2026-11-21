import imgReconnaitre from "@/assets/blog-reconnaitre.png";
import img24h from "@/assets/blog-24h.png";
import imgIdees from "@/assets/blog-idees-recues.png";
import imgPrevention from "@/assets/blog-prevention.png";
import imgRentree from "@/assets/blog-rentree.png";
import imgCycle from "@/assets/blog-cycle.png";

export type Article = {
  slug: string;
  titre: string;
  categorie: string;
  extrait: string;
  lecture: string;
  image: string;
  sections: { titre: string; paragraphes: string[] }[];
};

export const categories = [
  "Tous",
  "Bien comprendre les poux",
  "Conseils pratiques",
  "Prévention",
  "Vie de famille",
];

export const articles: Article[] = [
  {
    slug: "reconnaitre-poux-lentes",
    titre: "Comment reconnaître les poux et les lentes chez son enfant",
    categorie: "Bien comprendre les poux",
    extrait:
      "Démangeaisons, petits points blancs près du cuir chevelu… Voici comment vérifier calmement, en 10 minutes, sans se tromper.",
    lecture: "4 min",
    image: imgReconnaitre,
    sections: [
      {
        titre: "Les premiers signaux",
        paragraphes: [
          "Le signe le plus fréquent reste le grattage, surtout derrière les oreilles et à la nuque. Il peut apparaître plusieurs jours après la contamination : un enfant qui ne se gratte pas n'est donc pas forcément épargné.",
          "D'autres indices aident : un sommeil agité, de petites rougeurs sur la nuque, ou un signalement reçu par l'école.",
        ],
      },
      {
        titre: "Lente ou simple pellicule ?",
        paragraphes: [
          "Une pellicule se détache d'une simple pichenette. Une lente, elle, est collée à la base du cheveu et résiste quand on la fait glisser entre deux ongles.",
          "Les lentes vivantes se trouvent à moins d'un centimètre du cuir chevelu. Plus loin sur la longueur, il s'agit le plus souvent de coques vides déjà éclos.",
        ],
      },
      {
        titre: "La bonne méthode de vérification",
        paragraphes: [
          "Installez-vous près d'une fenêtre ou sous une bonne lampe. Appliquez un après-shampoing, puis passez un peigne à dents fines mèche par mèche, de la racine vers la pointe.",
          "Essuyez le peigne sur un mouchoir blanc après chaque passage : c'est là que l'on voit le plus clairement ce qui a été retiré.",
        ],
      },
      {
        titre: "Et si le doute persiste",
        paragraphes: [
          "Il est parfaitement normal d'hésiter, même en regardant attentivement. Un dépistage professionnel prend quelques minutes et lève le doute pour toute la famille.",
        ],
      },
    ],
  },
  {
    slug: "que-faire-24h",
    titre: "Que faire dans les 24h après la découverte de poux",
    categorie: "Conseils pratiques",
    extrait:
      "Pas de panique ni de grand ménage : voici les gestes vraiment utiles à faire le soir même et le lendemain.",
    lecture: "5 min",
    image: img24h,
    sections: [
      {
        titre: "D'abord, souffler",
        paragraphes: [
          "Les poux n'ont rien à voir avec la propreté ni avec la qualité des soins apportés à votre enfant. C'est un incident de parcours banal, qui touche des millions de familles chaque année.",
        ],
      },
      {
        titre: "Le soir même",
        paragraphes: [
          "Vérifiez toutes les têtes du foyer, adultes compris : traiter un seul membre de la famille est la principale cause de rechute.",
          "Attachez les cheveux longs, et évitez de partager brosses, bonnets et écharpes pendant quelques jours.",
        ],
      },
      {
        titre: "Le lendemain",
        paragraphes: [
          "Lavez à 60°C le linge de lit, les serviettes et les bonnets utilisés les deux derniers jours. Ce qui ne peut pas être lavé peut simplement rester 48h dans un sac fermé.",
          "Prévenez l'école ou la crèche : c'est un geste collectif utile, et personne ne vous jugera.",
        ],
      },
      {
        titre: "Ce qui ne sert à rien",
        paragraphes: [
          "Inutile d'aspirer les murs, de traiter les matelas avec des produits, ou de raser les cheveux. Les poux ne survivent pas plus de 24 à 48h loin du cuir chevelu.",
        ],
      },
    ],
  },
  {
    slug: "idees-recues",
    titre: "Poux : 5 idées reçues qui ne servent à rien (et ce qui marche vraiment)",
    categorie: "Bien comprendre les poux",
    extrait:
      "Vinaigre, mayonnaise, sèche-cheveux… On fait le tri entre les remèdes de grand-mère et les méthodes efficaces.",
    lecture: "4 min",
    image: imgIdees,
    sections: [
      {
        titre: "« Les poux sautent d'une tête à l'autre »",
        paragraphes: [
          "Non : ils ne sautent pas et ne volent pas. Ils passent par contact direct des cheveux, ou parfois via un bonnet partagé.",
        ],
      },
      {
        titre: "« Le vinaigre les tue »",
        paragraphes: [
          "Le vinaigre peut légèrement décoller les lentes, mais il ne tue pas les poux et irrite le cuir chevelu des enfants.",
        ],
      },
      {
        titre: "« Un shampoing suffit »",
        paragraphes: [
          "Aucun produit seul ne fait tout le travail. Le peignage méthodique reste l'étape décisive : c'est lui qui retire lentes et poux restants.",
        ],
      },
      {
        titre: "« Il faut couper les cheveux »",
        paragraphes: [
          "Jamais nécessaire. Des cheveux longs se traitent très bien, il faut simplement plus de temps de peignage.",
        ],
      },
      {
        titre: "Ce qui marche vraiment",
        paragraphes: [
          "Un produit étouffant d'origine naturelle, un peignage complet mèche par mèche, un contrôle de toutes les têtes du foyer, puis une vérification une semaine plus tard.",
        ],
      },
    ],
  },
  {
    slug: "eviter-le-retour",
    titre: "Comment éviter que les poux reviennent",
    categorie: "Prévention",
    extrait:
      "Après le traitement, quelques habitudes simples suffisent à garder la tête tranquille sur la durée.",
    lecture: "3 min",
    image: imgPrevention,
    sections: [
      {
        titre: "Les gestes du quotidien",
        paragraphes: [
          "Cheveux attachés ou tressés les jours d'école, brosse personnelle, bonnet à son nom : trois réflexes qui réduisent nettement les contaminations.",
        ],
      },
      {
        titre: "Le contrôle du dimanche",
        paragraphes: [
          "Un peignage de 5 minutes une fois par semaine, sur cheveux humides, permet de repérer un nouveau foyer avant qu'il ne s'installe.",
        ],
      },
      {
        titre: "Les sprays préventifs",
        paragraphes: [
          "Ils rendent le cheveu moins accueillant, sans être une garantie absolue. Ils s'utilisent en complément du contrôle régulier, surtout en période d'épidémie à l'école.",
        ],
      },
    ],
  },
  {
    slug: "checklist-rentree",
    titre: "Rentrée scolaire : notre check-list anti-poux",
    categorie: "Vie de famille",
    extrait:
      "La rentrée est la période la plus propice aux poux. Voici la liste courte à garder sur le frigo.",
    lecture: "3 min",
    image: imgRentree,
    sections: [
      {
        titre: "Avant la rentrée",
        paragraphes: [
          "Un dépistage rapide de toute la famille la veille permet de partir sur des bases saines et d'éviter le classique signalement de la deuxième semaine.",
        ],
      },
      {
        titre: "Pendant le premier mois",
        paragraphes: [
          "Contrôle hebdomadaire, cheveux attachés, affaires personnelles identifiées. Si un signalement circule dans la classe, vérifiez le soir même plutôt que d'attendre.",
        ],
      },
      {
        titre: "En cas d'alerte dans la classe",
        paragraphes: [
          "Vérifiez sans traiter à l'aveugle : un traitement appliqué sans poux ne protège de rien et fatigue le cuir chevelu.",
        ],
      },
    ],
  },
  {
    slug: "cycle-de-vie",
    titre: "Le cycle de vie du pou expliqué simplement",
    categorie: "Bien comprendre les poux",
    extrait:
      "Comprendre le cycle en trois étapes explique pourquoi un second contrôle, une semaine après, change tout.",
    lecture: "4 min",
    image: imgCycle,
    sections: [
      {
        titre: "Trois étapes, environ un mois",
        paragraphes: [
          "La lente éclôt en 7 à 10 jours, la jeune forme grandit une dizaine de jours, puis l'adulte vit environ trois semaines sur le cuir chevelu.",
        ],
      },
      {
        titre: "Pourquoi le second contrôle est décisif",
        paragraphes: [
          "Aucun produit ne détruit toutes les lentes à coup sûr. Un contrôle une semaine plus tard intercepte les éventuelles éclosions avant qu'elles ne pondent à leur tour, et casse le cycle.",
        ],
      },
      {
        titre: "Hors de la tête, ils ne survivent pas",
        paragraphes: [
          "Privé de chaleur et de nourriture, un pou ne tient pas plus de 24 à 48 heures. Voilà pourquoi la maison n'a pas besoin d'être traitée de fond en comble.",
        ],
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
