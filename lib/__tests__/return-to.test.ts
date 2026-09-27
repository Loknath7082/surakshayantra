import { describe, expect, it } from "vitest";
import { validateReturnTo } from "@/lib/return-to";

describe("validateReturnTo", () => {
  it("accepts /portal/requests", () => {
    expect(validateReturnTo("/portal/requests")).toBe("/portal/requests");
  });

  it("rejects https://evil.com", () => {
    expect(validateReturnTo("https://evil.com")).toBeNull();
  });

  it("rejects //evil.com", () => {
    expect(validateReturnTo("//evil.com")).toBeNull();
  });

  it("rejects /\\evil.com", () => {
    expect(validateReturnTo("/\\evil.com")).toBeNull();
  });

  it("rejects /foo\\bar", () => {
    expect(validateReturnTo("/foo\\bar")).toBeNull();
  });

  it("rejects /%5Cevil.com", () => {
    expect(validateReturnTo("/%5Cevil.com")).toBeNull();
  });

  it("rejects /%2F%2Fevil.com", () => {
    expect(validateReturnTo("/%2F%2Fevil.com")).toBeNull();
  });

  it("rejects /%255Cevil.com", () => {
    expect(validateReturnTo("/%255Cevil.com")).toBeNull();
  });

  it("rejects /%00", () => {
    expect(validateReturnTo("/%00")).toBeNull();
  });

  it("rejects /%0A", () => {
    expect(validateReturnTo("/%0A")).toBeNull();
  });

  it("rejects /%ZZ", () => {
    expect(validateReturnTo("/%ZZ")).toBeNull();
  });

  it("rejects /portal/../admin", () => {
    expect(validateReturnTo("/portal/../admin")).toBeNull();
  });

  it("rejects /portal/%2e%2e/admin", () => {
    expect(validateReturnTo("/portal/%2e%2e/admin")).toBeNull();
  });

  it("rejects /portal#section", () => {
    expect(validateReturnTo("/portal#section")).toBeNull();
  });

  it("rejects invalid types and empty strings", () => {
    expect(validateReturnTo("")).toBeNull();
    expect(validateReturnTo(null)).toBeNull();
    expect(validateReturnTo(undefined)).toBeNull();
    expect(validateReturnTo(123)).toBeNull();
    expect(validateReturnTo({})).toBeNull();
  });
});
