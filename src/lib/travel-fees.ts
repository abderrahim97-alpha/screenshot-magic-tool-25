type TravelZone = {
  label: string;
  amount: number;
  towns: string[];
};

export const travelZones: TravelZone[] = [
  {
    label: "Zone 1 – 5 €",
    amount: 5,
    towns: ["Tournefeuille", "Pibrac", "Cornebarrieu", "Blagnac", "Plaisance-du-Touch"],
  },
  {
    label: "Zone 2 – 10 €",
    amount: 10,
    towns: [
      "Toulouse",
      "La Salvetat-Saint-Gilles",
      "Brax",
      "Léguevin",
      "Beauzelle",
      "Mondonville",
      "Aussonne",
      "Cugnaux",
    ],
  },
  {
    label: "Zone 3 – 15 €",
    amount: 15,
    towns: ["Seilh", "Fenouillet", "Frouzins", "Villeneuve-Tolosane"],
  },
];

export const travelTownGroups = [
  { label: "Colomiers", towns: ["Colomiers"] },
  ...travelZones.map((zone) => ({ label: zone.label, towns: [...zone.towns] })),
] as const;

export type TravelFee = {
  amount: number | null;
  label: string;
  isFree: boolean;
};

export function getTravelFee(town: string): TravelFee | null {
  if (!town) return null;
  if (town === "Colomiers") {
    return { amount: 0, label: "Frais de déplacement : offerts", isFree: true };
  }

  const zone = travelZones.find((candidate) => candidate.towns.includes(town));
  if (zone) {
    return {
      amount: zone.amount,
      label: `Frais de déplacement : ${zone.amount} €`,
      isFree: false,
    };
  }

  return { amount: null, label: "Frais de déplacement : sur devis", isFree: false };
}

export const FAMILY_DISCOUNT_PER_ADDITIONAL_PERSON = 10;

export function getFamilyDiscount({
  peopleCount,
  sameDay,
  sameAddress,
}: {
  peopleCount: number;
  sameDay: boolean;
  sameAddress: boolean;
}) {
  if (!sameDay || !sameAddress || peopleCount < 2) return 0;
  return (peopleCount - 1) * FAMILY_DISCOUNT_PER_ADDITIONAL_PERSON;
}
