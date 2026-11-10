import { describe, expect, it } from "bun:test";

import {
  getFamilyDiscount,
  getTravelFee,
  travelZones,
} from "../src/lib/travel-fees";

describe("user-provided travel charges", () => {
  it("maps each listed town to its exact travel fee", () => {
    expect(travelZones.map(({ amount, towns }) => ({ amount, towns }))).toEqual([
      {
        amount: 5,
        towns: ["Tournefeuille", "Pibrac", "Cornebarrieu", "Blagnac", "Plaisance-du-Touch"],
      },
      {
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
        amount: 15,
        towns: ["Seilh", "Fenouillet", "Frouzins", "Villeneuve-Tolosane"],
      },
    ]);
    expect(getTravelFee("Colomiers")).toEqual({
      amount: 0,
      label: "Frais de déplacement : offerts",
      isFree: true,
    });
    expect(getTravelFee("Autre commune")).toEqual({
      amount: null,
      label: "Frais de déplacement : sur devis",
      isFree: false,
    });
  });
});

describe("same-visit family discount", () => {
  it("deducts €10 for each additional person only on the same day and address", () => {
    expect(getFamilyDiscount({ peopleCount: 1, sameDay: true, sameAddress: true })).toBe(0);
    expect(getFamilyDiscount({ peopleCount: 2, sameDay: true, sameAddress: true })).toBe(10);
    expect(getFamilyDiscount({ peopleCount: 3, sameDay: true, sameAddress: true })).toBe(20);
    expect(getFamilyDiscount({ peopleCount: 3, sameDay: false, sameAddress: true })).toBe(0);
    expect(getFamilyDiscount({ peopleCount: 3, sameDay: true, sameAddress: false })).toBe(0);
  });
});