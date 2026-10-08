import { describe, expect, it } from "vitest";
import { toNewVehicleDto, toVehicle, toVehicleList } from "./mappers";

describe("fleet mappers", () => {
  it("maps an API vehicle into the front-end model", () => {
    const vehicle = toVehicle({
      id: 7,
      brand: "Kia",
      model: "Rio",
      year: "2022",
      dailyRate: "350",
      status: "available",
    });
    expect(vehicle).toEqual({
      id: 7,
      make: "Kia",
      model: "Rio",
      year: 2022,
      category: "Other",
      pricePerDay: 350,
      available: true,
      imageUrl: null,
    });
  });

  it("treats any other status as not available", () => {
    expect(toVehicle({ id: 1, status: "RENTED" }).available).toBe(false);
  });

  it("reads both a plain array and a Spring page", () => {
    expect(toVehicleList([{ id: 1 }])).toHaveLength(1);
    expect(toVehicleList({ content: [{ id: 1 }, { id: 2 }] })).toHaveLength(2);
    expect(toVehicleList(null)).toEqual([]);
  });

  it("builds a clean request body for a new vehicle", () => {
    expect(
      toNewVehicleDto({ make: " Kia ", model: "Rio", year: "2022", category: "Hatchback", pricePerDay: "350" })
    ).toEqual({ make: "Kia", model: "Rio", year: 2022, category: "Hatchback", pricePerDay: 350 });
  });
});
