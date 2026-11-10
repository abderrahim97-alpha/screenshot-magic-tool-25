export const site = {
  name: "Poux Chrono 31",
  slogan: "Traitement des poux • Rapide • Sûr • Efficace",
  // TODO : remplacer par le vrai numéro avant mise en ligne
  phoneDisplay: "06 12 34 56 78",
  phoneHref: "tel:+33612345678",
  whatsappHref: "https://wa.me/33612345678",
  email: "contact@pouxchrono31.fr",
  horaires: "7j/7, de 8h à 20h",
  zone: "Toulouse & Haute-Garonne (31)",
};

export const villes = [
  "Toulouse",
  "Blagnac",
  "Colomiers",
  "Tournefeuille",
  "Balma",
  "Muret",
  "Cugnaux",
  "Ramonville",
  "L'Union",
  "Plaisance-du-Touch",
  "Castanet-Tolosan",
  "Saint-Orens",
];

export const tarifs = [
  { type: "Cheveux courts", detail: "Jusqu'aux oreilles", prix: "49 €", duree: "45 min" },
  { type: "Cheveux mi-longs", detail: "Jusqu'aux épaules", prix: "69 €", duree: "1 h" },
  { type: "Cheveux longs", detail: "Au-delà des épaules", prix: "89 €", duree: "1 h 15" },
  { type: "Cheveux extra-longs", detail: "Très denses ou bouclés", prix: "109 €", duree: "1 h 30" },
  {
    type: "Forte infestation",
    detail: "Sur devis après diagnostic",
    prix: "à partir de 129 €",
    duree: "1 h 45",
  },
];

export const temoignages = [
  {
    prenom: "Sophie",
    ville: "Toulouse",
    texte:
      "Appel à 18h, intervention le soir même. Ma fille n'a pas eu peur une seconde, tout s'est fait en douceur. Un vrai soulagement.",
  },
  {
    prenom: "Karim",
    ville: "Colomiers",
    texte:
      "Très professionnel et zéro jugement. On nous a tout expliqué calmement, et les conseils de prévention nous ont beaucoup aidés.",
  },
  {
    prenom: "Élodie",
    ville: "Blagnac",
    texte:
      "Trois enfants traités en une seule visite. Aucun produit agressif, pas d'odeur, et plus rien depuis. Je recommande sans hésiter.",
  },
  {
    prenom: "Nadia",
    ville: "Balma",
    texte:
      "J'étais au bord des larmes au téléphone, on m'a tout de suite rassurée. Le rendez-vous a été fixé pour le lendemain matin.",
  },
  {
    prenom: "Thomas",
    ville: "Tournefeuille",
    texte:
      "Ponctuel, soigneux, très patient avec mon fils de 4 ans. Le tarif annoncé était exactement celui payé, aucune surprise.",
  },
];

export const faq = [
  {
    q: "Le traitement est-il douloureux ?",
    r: "Pas du tout. Il s'agit d'un soin doux du cuir chevelu, suivi d'un peignage minutieux. La plupart des enfants regardent un dessin animé pendant la séance.",
  },
  {
    q: "Mon enfant peut-il retourner à l'école le lendemain ?",
    r: "Oui. Après l'intervention, il n'y a plus de poux vivants : votre enfant peut reprendre l'école dès le lendemain matin en toute tranquillité.",
  },
  {
    q: "Faut-il désinfecter toute la maison ?",
    r: "Non, inutile de tout vider. Un lavage du linge de lit et des bonnets à 60°C suffit dans la grande majorité des cas. On vous laisse une petite liste simple.",
  },
  {
    q: "Le traitement est-il sûr pour les bébés et les femmes enceintes ?",
    r: "Oui. Nos produits sont d'origine naturelle, sans insecticide, testés dermatologiquement et adaptés dès le plus jeune âge ainsi qu'aux femmes enceintes.",
  },
  {
    q: "Combien de temps dure une intervention ?",
    r: "Entre 45 minutes et 1h30 selon la longueur des cheveux et le nombre de personnes. On vous donne une estimation précise dès l'appel.",
  },
  {
    q: "Et si les poux reviennent après le traitement ?",
    r: "Un contrôle gratuit est prévu sous 10 jours si vous le souhaitez. En cas de nouveau foyer lié au traitement, nous revenons sans frais supplémentaires.",
  },
];

export const services = [
  {
    slug: "traitement-domicile",
    titre: "Traitement à domicile express",
    resume: "Diagnostic, traitement complet et peignage de toute la famille, chez vous.",
    prix: "à partir de 49 €",
    duree: "45 min à 1h30",
    public: "Enfants dès 6 mois, adultes, familles entières",
    details: [
      "Diagnostic précis de chaque tête à la lampe et au peigne fin",
      "Application d'une lotion d'origine naturelle, sans insecticide",
      "Peignage méthodique mèche par mèche jusqu'à élimination complète",
      "Vérification finale devant vous et conseils personnalisés",
    ],
  },
  {
    slug: "diagnostic-depistage",
    titre: "Diagnostic & dépistage",
    resume: "Un doute ? On vérifie chaque tête et on vous dit clairement où vous en êtes.",
    prix: "19 € par personne",
    duree: "15 min par tête",
    public: "Familles, fratries, doutes après un signalement à l'école",
    details: [
      "Contrôle complet du cuir chevelu, sans traitement inutile",
      "Distinction claire entre lentes vivantes et résidus",
      "Compte rendu simple et honnête : parfois, il n'y a rien à traiter",
      "Le montant est déduit si un traitement est réalisé dans la foulée",
    ],
  },
  {
    slug: "collectivite",
    titre: "Intervention en collectivité",
    resume: "Écoles, crèches et centres de loisirs : dépistage groupé et accompagnement.",
    prix: "sur devis",
    duree: "demi-journée ou journée",
    public: "Écoles, crèches, ALSH, colonies",
    details: [
      "Dépistage de groupe organisé discrètement, classe par classe",
      "Information claire remise aux familles concernées",
      "Protocole de prévention adapté à l'établissement",
      "Suivi et second passage possible après 10 jours",
    ],
  },
];
