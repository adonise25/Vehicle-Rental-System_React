import { describe, expect, it } from "vitest";
import { canRent, filterVehicles, validateVehicleDraft } from "./rules";

const cars = [
  { id: 1, make: "Toyota", model: "Corolla", category: "Sedan", available: true },
  { id: 2, make: "Ford", model: "Ranger", category: "Bakkie", available: false },
];

describe("fleet rules", () => {
  it("allows renting only available vehicles", () => {
    expect(canRent(cars[0])).toBe(true);
    expect(canRent(cars[1])).toBe(false);
    expect(canRent(undefined)).toBe(false);
  });

  it("searches make, model and category", () => {
    expect(filterVehicles(cars, { query: "ranger" }).map((v) => v.id)).toEqual([2]);
    expect(filterVehicles(cars, { query: "sedan" }).map((v) => v.id)).toEqual([1]);
  });

  it("can show available vehicles only", () => {
    expect(filterVehicles(cars, { onlyAvailable: true }).map((v) => v.id)).toEqual([1]);
  });

  it("rejects an incomplete or unrealistic draft", () => {
    const errors = validateVehicleDraft({ make: "", model: " ", year: 1900, pricePerDay: 0 }, 2026);
    expect(Object.keys(errors).sort()).toEqual(["make", "model", "pricePerDay", "year"]);
  });

  it("accepts a valid draft", () => {
    const draft = { make: "Kia", model: "Rio", year: "2022", pricePerDay: "350" };
    expect(validateVehicleDraft(draft, 2026)).toEqual({});
  });
});
