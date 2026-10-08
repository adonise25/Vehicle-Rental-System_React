import { storage } from "./storage";

const TOKEN_KEY = "driveeasy_token";

// Fired by the HTTP client when the server rejects an authenticated request (401).
export const SESSION_EXPIRED_EVENT = "auth:session-expired";

let memoryToken = null;

export const getToken = () => memoryToken ?? storage.get(TOKEN_KEY);

export const setToken = (token) => {
  memoryToken = token;
  storage.set(TOKEN_KEY, token);
};

export const clearToken = () => {
  memoryToken = null;
  storage.remove(TOKEN_KEY);
};
