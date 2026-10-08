let nextRentalId = 1;

export const mockRentalApi = {
  async create(rental) {
    const start = new Date(`${rental.startDate}T00:00:00`);
    const end = new Date(`${rental.endDate}T00:00:00`);

    const days = Math.ceil(
      (end.getTime() - start.getTime()) / 86_400_000
    );

    return {
      id: nextRentalId++,
      vehicleId: Number(rental.vehicleId),
      startDate: rental.startDate,
      endDate: rental.endDate,
      totalCost: days * 500,
      status: "ACTIVE",
    };
  },
};