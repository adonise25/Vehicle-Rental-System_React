let nextRentalId = 1;

const rentals = [];

export const mockRentalApi = {
  async create(rental) {
    const start = new Date(`${rental.startDate}T00:00:00`);
    const end = new Date(`${rental.endDate}T00:00:00`);

    const days = Math.ceil(
      (end.getTime() - start.getTime()) / 86_400_000
    );

    const newRental = {
      id: nextRentalId++,
      userId: 1,
      vehicleId: Number(rental.vehicleId),
      startDate: rental.startDate,
      endDate: rental.endDate,
      totalCost: days * 500,
      status: "ACTIVE",
    };

    rentals.push(newRental);

    return newRental;
  },

  async listByUser() {
    return [...rentals];
  },

  async returnRental(rentalId) {
    const rental = rentals.find(
      (item) => item.id === Number(rentalId)
    );

    if (!rental) {
      throw new Error("Rental not found.");
    }

    if (rental.status !== "ACTIVE") {
      throw new Error("Rental has already been returned.");
    }

    rental.status = "RETURNED";

    return { ...rental };
  },
};