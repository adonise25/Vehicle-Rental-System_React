import { http } from "../../../shared/http/client";
import { toRental, toRentalList } from "../mappers";

export const httpRentalApi = {
  async create(rental) {
    const data = await http.post("/api/rentals", {
      vehicleId: Number(rental.vehicleId),
      startDate: rental.startDate,
      endDate: rental.endDate,
    });

    return toRental(data);
  },

  async listByUser(userId) {
    const data = await http.get(`/api/rentals/${userId}`, {
      expect: "json",
    });

    return toRentalList(data);
  },

  async returnRental(rentalId) {
    const data = await http.post(
      `/api/rentals/${rentalId}/return`
    );

    return toRental(data);
  },
};