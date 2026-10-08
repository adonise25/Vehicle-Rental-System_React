import { http } from "../../../shared/http/client";
import { ApiError } from "../../../shared/http/errors";
import {
  toCredentialsDto,
  toRegisterDto,
} from "../mappers";

const INVALID_CREDENTIALS = "Invalid email or password.";

function toBasicAuth(email, password) {
  return `Basic ${btoa(`${email}:${password}`)}`;
}

export const httpAuthApi = {
  async register(credentials) {
    await http.post(
      "/api/auth/register",
      toRegisterDto(credentials)
    );
  },

  async login(credentials) {
    const { email, password } = toCredentialsDto(credentials);

    const basicAuth = toBasicAuth(email, password);

    try {
      await http.get("/api/vehicles", {
        expect: "json",
        authorization: basicAuth,
      });

      return basicAuth;
    } catch (err) {
      if (err instanceof ApiError && [401, 403].includes(err.status)) {
        throw new ApiError({
          kind: "unauthorized",
          status: err.status,
          message: INVALID_CREDENTIALS,
        });
      }

      throw err;
    }
  },

  async getCurrentUser() {
    return http.get("/api/auth/me", {
      expect: "json",
    });
  },
};