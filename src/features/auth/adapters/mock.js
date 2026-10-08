import { ApiError } from "../../../shared/http/errors";

// In-memory stand-in for the backend. Demo account: demo@driveeasy.com / password123
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const users = [{ email: "demo@driveeasy.com", password: "password123" }];

export const mockAuthApi = {
  async register({ email, password }) {
    await delay();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new ApiError({
        kind: "client",
        status: 409,
        message: "An account with this email already exists.",
      });
    }
    users.push({ email: email.trim(), password });
  },

  async login({ email, password }) {
    await delay();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      throw new ApiError({ kind: "unauthorized", status: 401, message: "Invalid email or password." });
    }
    return `mock-token-${user.email}`;
  },
};
