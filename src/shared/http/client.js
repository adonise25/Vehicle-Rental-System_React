import {
  API_URL,
  MAX_GET_RETRIES,
  REQUEST_TIMEOUT_MS,
  RETRY_BASE_DELAY_MS,
} from "../config";

import {
  clearToken,
  getToken,
  SESSION_EXPIRED_EVENT,
} from "../session";

import { ApiError, MESSAGES } from "./errors";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseBody(text) {
  if (!text) return { ok: true, data: null };

  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, data: text };
  }
}

async function send(path, { method, body, expect, authorization }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const token = getToken();

  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  /*
   * If this request provides its own Authorization header,
   * use it.
   *
   * Otherwise use the saved authentication credential.
   *
   * The backend currently uses HTTP Basic Authentication,
   * not Bearer/JWT authentication.
   */
  if (authorization) {
    headers.Authorization = authorization;
  } else if (token) {
    headers.Authorization = token;
  }

  let res;
  let text;

  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    text = await res.text();
  } catch (err) {
    throw new ApiError({
      kind: err?.name === "AbortError" ? "timeout" : "network",
      retryable: true,
    });
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 401) {
    if (token) {
      clearToken();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      }

      throw new ApiError({
        kind: "unauthorized",
        status: 401,
        message: MESSAGES.expired,
      });
    }

    throw new ApiError({
      kind: "unauthorized",
      status: 401,
    });
  }

  if (res.status === 403) {
    throw new ApiError({
      kind: "forbidden",
      status: 403,
    });
  }

  const parsed = parseBody(text);

  const serverMessage =
    parsed.ok &&
    parsed.data &&
    typeof parsed.data === "object"
      ? parsed.data.message || parsed.data.error
      : null;

  if (!res.ok) {
    if (res.status >= 500) {
      throw new ApiError({
        kind: "server",
        status: res.status,
        retryable: true,
      });
    }

    throw new ApiError({
      kind: "client",
      status: res.status,
      message: serverMessage || `Request failed (${res.status}).`,
    });
  }

  if (expect === "json" && !parsed.ok) {
    throw new ApiError({
      kind: "garbled",
      status: res.status,
    });
  }

  return parsed.data;
}

export async function request(path, options = {}) {
  const method = options.method || "GET";

  const maxRetries =
    method === "GET" ? MAX_GET_RETRIES : 0;

  for (let attempt = 0; ; attempt += 1) {
    try {
      return await send(path, {
        ...options,
        method,
      });
    } catch (err) {
      const canRetry =
        err instanceof ApiError &&
        err.retryable &&
        attempt < maxRetries;

      if (!canRetry) {
        throw err;
      }

      await sleep(
        RETRY_BASE_DELAY_MS * 2 ** attempt
      );
    }
  }
}

export const http = {
  get: (path, options) =>
    request(path, {
      ...options,
      method: "GET",
    }),

  post: (path, body, options) =>
    request(path, {
      ...options,
      method: "POST",
      body,
    }),

  put: (path, body, options) =>
    request(path, {
      ...options,
      method: "PUT",
      body,
    }),

      del: (path, options) =>
    request(path, {
      ...options,
      method: "DELETE",
    }),
};