// Port: the rest of the auth feature only ever uses `authApi`.
// Which adapter backs it is decided here, from .env.
import { USE_MOCK } from "../../shared/config";
import { httpAuthApi } from "./adapters/http";
import { mockAuthApi } from "./adapters/mock";

export const authApi = USE_MOCK ? mockAuthApi : httpAuthApi;
