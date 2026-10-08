import { http } from "../../../shared/http/client";
import { toRental } from "../mappers";

export const httpRentalApi = {
  async create(rental) {
    const data = await http.post("/api/rentals", {
      vehicleId: Number(rental.vehicleId),
      startDate: rental.startDate,
      endDate: rental.endDate,
    });

    return toRental(data);
  },
};
