import { http } from "../../../shared/http/client";
import {
  toNewVehicleDto,
  toVehicle,
  toVehicleList,
} from "../mappers";

export const httpFleetApi = {
  async list() {
    const data = await http.get("/api/vehicles", {
      expect: "json",
    });

    return toVehicleList(data);
  },

  async add(draft) {
    const data = await http.post(
      "/api/vehicles",
      toNewVehicleDto(draft)
    );

    return data && typeof data === "object"
      ? toVehicle(data)
      : null;
  },

  async remove(id) {
    await http.del(`/api/vehicles/${id}`);
  },
};
