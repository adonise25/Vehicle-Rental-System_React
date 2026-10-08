// Every failure leaves the HTTP layer as an ApiError with a known kind.
// That keeps the UI's reaction predictable: it never sees raw fetch errors.
//
// kind: network | timeout | unauthorized | forbidden | client | server | garbled

export const MESSAGES = {
  network: "Cannot reach the server. Check your connection and try again.",
  timeout: "The server took too long to respond. Please try again.",
  server: "Something went wrong on the server. Please try again shortly.",
  garbled: "The server sent a response we could not read.",
  expired: "Your session has expired. Please log in again.",
  unauthorized: "You are not authorised to do that.",
  forbidden: "You do not have permission to do that.",
  unknown: "Something unexpected went wrong.",
};

export class ApiError extends Error {
  constructor({ kind, message, status = null, retryable = false }) {
    super(message ?? MESSAGES[kind] ?? MESSAGES.unknown);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.retryable = retryable;
  }
}

// Safe text for the screen, whatever was thrown.
export const messageOf = (err) => (err instanceof ApiError ? err.message : MESSAGES.unknown);
