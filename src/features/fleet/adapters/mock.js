import { ApiError } from "../../../shared/http/errors";

// In-memory stand-in for the backend, already in the front-end Vehicle model.
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const v = (id, make, model, year, category, pricePerDay, available) => ({
  id,
  make,
  model,
  year,
  category,
  pricePerDay,
  available,
  imageUrl: null,
});

const vehicles = [
  v(1, "Toyota", "Corolla", 2022, "Sedan", 450, true),
  v(2, "Volkswagen", "Polo", 2023, "Hatchback", 380, true),
  v(3, "Ford", "Ranger", 2021, "Bakkie", 750, false),
  v(4, "Toyota", "Fortuner", 2022, "SUV", 890, true),
  v(5, "Hyundai", "i20", 2023, "Hatchback", 360, true),
  v(6, "BMW", "320i", 2021, "Sedan", 1100, true),
  v(7, "Suzuki", "Swift", 2022, "Hatchback", 340, false),
  v(8, "Mercedes-Benz", "GLC", 2022, "SUV", 1350, true),
];
let nextId = 9;

export const mockFleetApi = {
  async list() {
    await delay(300);
    return vehicles.map((x) => ({ ...x }));
  },

  async rent(id) {
    await delay(500);
    const vehicle = vehicles.find((x) => x.id === id);
    if (!vehicle) throw new ApiError({ kind: "client", status: 404, message: "Vehicle not found." });
    if (!vehicle.available) {
      throw new ApiError({ kind: "client", status: 409, message: "That vehicle was just rented." });
    }
    vehicle.available = false;
  },

  async add(draft) {
    await delay(500);
    const vehicle = {
      id: nextId++,
      make: String(draft.make).trim(),
      model: String(draft.model).trim(),
      year: Number(draft.year),
      category: draft.category,
      pricePerDay: Number(draft.pricePerDay),
      available: true,
      imageUrl: null,
    };
    vehicles.unshift(vehicle);
    return { ...vehicle };
  },
};
