import { describe, it, expect } from "vitest";
import { DISPOSABLE_DOMAINS, isDisposableEmail } from "@/lib/disposable-emails";

describe("isDisposableEmail", () => {
  it("returns true for exact disposable email match", () => {
    expect(isDisposableEmail("user@mailinator.com")).toBe(true);
  });

  it("returns true for case-insensitive disposable email", () => {
    expect(isDisposableEmail("USER@MAILINATOR.COM")).toBe(true);
  });

  it("returns false for legitimate email domains", () => {
    expect(isDisposableEmail("user@gmail.com")).toBe(false);
  });

  it("returns false for subdomains (exact-only matching)", () => {
    expect(isDisposableEmail("user@sub.mailinator.com")).toBe(false);
  });

  it("returns false for domain suffix attacks", () => {
    expect(isDisposableEmail("user@mailinator.com.evil.com")).toBe(false);
  });

  it("returns true for tagged emails with disposable domain", () => {
    expect(isDisposableEmail("user+tag@mailinator.com")).toBe(true);
  });

  it("returns false for empty string", () => {
    expect(isDisposableEmail("")).toBe(false);
  });

  it("returns false for email with empty domain", () => {
    expect(isDisposableEmail("user@")).toBe(false);
  });

  it("returns false for malformed email without @", () => {
    expect(isDisposableEmail("malformed.email.com")).toBe(false);
  });
});

describe("DISPOSABLE_DOMAINS", () => {
  it("has all entries in lowercase", () => {
    for (const domain of DISPOSABLE_DOMAINS) {
      expect(domain).toBe(domain.toLowerCase());
    }
  });

  it("contains no duplicates", () => {
    const unique = new Set(DISPOSABLE_DOMAINS);
    expect(unique.size).toBe(DISPOSABLE_DOMAINS.length);
  });

  it("is alphabetically sorted", () => {
    const sorted = [...DISPOSABLE_DOMAINS].sort();
    expect(DISPOSABLE_DOMAINS).toEqual(sorted);
  });
});
