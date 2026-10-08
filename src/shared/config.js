// Single place for runtime settings. Values come from .env (see .env.example).
export const API_URL = import.meta.env.VITE_API_URL || "";
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Resilience settings used by shared/http/client.js
export const REQUEST_TIMEOUT_MS = 10_000;
export const MAX_GET_RETRIES = 2; // GET only; writes are never retried
export const RETRY_BASE_DELAY_MS = 300; // doubles on each retry

// Service limit: never ask the API for an unbounded list.
export const DEFAULT_PAGE_SIZE = 50;
