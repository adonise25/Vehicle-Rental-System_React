import { describe, expect, it } from "vitest";
import { validateLogin, validateRegistration } from "./rules";

describe("auth rules", () => {
  it("requires email and password to log in", () => {
    expect(validateLogin({ email: " ", password: "" })).toEqual({
      email: expect.any(String),
      password: expect.any(String),
    });
    expect(validateLogin({ email: "a@b.co", password: "x" })).toEqual({});
  });

  it("rejects a bad email, short password and mismatched confirmation", () => {
    const errors = validateRegistration({ email: "nope", password: "123", confirm: "321" });
    expect(Object.keys(errors).sort()).toEqual(["confirm", "email", "password"]);
  });

  it("accepts a valid registration", () => {
    expect(
      validateRegistration({ email: "thulani@example.com", password: "secret1", confirm: "secret1" })
    ).toEqual({});
  });
});
