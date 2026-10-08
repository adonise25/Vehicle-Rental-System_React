// Port: the fleet feature only ever uses `fleetApi` (list, rent, add).
// Which adapter backs it is decided here, from .env.
import { USE_MOCK } from "../../shared/config";
import { httpFleetApi } from "./adapters/http";
import { mockFleetApi } from "./adapters/mock";

export const fleetApi = USE_MOCK ? mockFleetApi : httpFleetApi;
