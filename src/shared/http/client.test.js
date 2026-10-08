import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { http } from "./client";

const reply = (status, body) =>
  new Response(typeof body === "string" ? body : JSON.stringify(body), { status });

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("http client", () => {
  it("retries a GET after a 503 and returns the later success", async () => {
    fetch.mockResolvedValueOnce(reply(503, "")).mockResolvedValueOnce(reply(200, [{ id: 1 }]));
    const data = await http.get("/api/vehicles", { expect: "json" });
    expect(data).toEqual([{ id: 1 }]);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("does not retry a 4xx and surfaces the server message", async () => {
    fetch.mockResolvedValue(reply(400, { message: "Year is invalid" }));
    await expect(http.get("/api/vehicles")).rejects.toMatchObject({
      kind: "client",
      status: 400,
      message: "Year is invalid",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("never retries a POST", async () => {
    fetch.mockResolvedValue(reply(503, ""));
    await expect(http.post("/api/vehicles/1/rent")).rejects.toMatchObject({ kind: "server" });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("reports a network failure as a predictable error", async () => {
    fetch.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(http.post("/api/vehicles", {})).rejects.toMatchObject({
      kind: "network",
      retryable: true,
    });
  });

  it("flags an unreadable body when JSON is expected", async () => {
    fetch.mockResolvedValue(reply(200, "<html>oops</html>"));
    await expect(http.get("/api/vehicles", { expect: "json" })).rejects.toMatchObject({
      kind: "garbled",
    });
  });

  it("accepts a plain-text success body by default", async () => {
    fetch.mockResolvedValue(reply(200, "User registered"));
    await expect(http.post("/api/auth/register", {})).resolves.toBe("User registered");
  });
});
