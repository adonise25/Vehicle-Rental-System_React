import { USE_MOCK } from "../../shared/config";
import { httpRentalApi } from "./adapters/http";
import { mockRentalApi } from "./adapters/mock";

export const rentalApi = USE_MOCK ? mockRentalApi : httpRentalApi;