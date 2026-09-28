import { describe, it, expect } from "vitest";
import {
  signInSchema,
  signUpSchema,
  otpSchema,
  signupEmailSchema,
  backupCodeSchema,
} from "@/lib/validations/auth";

describe("auth validation schemas", () => {
  describe("signupEmailSchema", () => {
    it("accepts valid email and normalizes it", () => {
      const result = signupEmailSchema.safeParse({ email: " Test@Example.COM " });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("test@example.com");
      }
    });

    it("rejects invalid email formats", () => {
      const result = signupEmailSchema.safeParse({ email: "invalid-email" });
      expect(result.success).toBe(false);
    });
  });

  describe("signInSchema", () => {
    it("validates valid credentials", () => {
      const result = signInSchema.safeParse({
        email: "user@example.com",
        password: "secretpassword",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty password", () => {
      const result = signInSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects malformed email", () => {
      const result = signInSchema.safeParse({
        email: "not-an-email",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("signUpSchema", () => {
    const validSignup = {
      email: "user@company.com",
      password: "Abcd12@#",
      confirmPassword: "Abcd12@#",
    };

    it("accepts a valid 8-character password with letter, number, and allowed special", () => {
      const result = signUpSchema.safeParse(validSignup);
      expect(result.success).toBe(true);
    });

    it.each(["@", "#", "$", "%", "&", "*"] as const)(
      "accepts allowed special character %s",
      (special) => {
        const password = `Abcd12${special}x`;
        const result = signUpSchema.safeParse({
          email: "user@company.com",
          password,
          confirmPassword: password,
        });
        expect(result.success).toBe(true);
      },
    );

    it("rejects password shorter than 8 characters", () => {
      const result = signUpSchema.safeParse({
        email: "user@company.com",
        password: "Ab1@xyz",
        confirmPassword: "Ab1@xyz",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("at least 8 characters");
      }
    });

    it("rejects password with no letter", () => {
      const result = signUpSchema.safeParse({
        email: "user@company.com",
        password: "1234567@",
        confirmPassword: "1234567@",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.message.includes("letter"))).toBe(true);
      }
    });

    it("rejects password with no number", () => {
      const result = signUpSchema.safeParse({
        email: "user@company.com",
        password: "Abcdefg@",
        confirmPassword: "Abcdefg@",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((issue) => issue.message.includes("number"))).toBe(true);
      }
    });

    it("rejects password with no allowed special character", () => {
      const result = signUpSchema.safeParse({
        email: "user@company.com",
        password: "Abcd1234",
        confirmPassword: "Abcd1234",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.message.includes("special character")),
        ).toBe(true);
      }
    });

    it("rejects < or > in place of an allowed special character", () => {
      for (const password of ["Abcd123<", "Abcd123>"]) {
        const result = signUpSchema.safeParse({
          email: "user@company.com",
          password,
          confirmPassword: password,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) => issue.message.includes("special character")),
          ).toBe(true);
        }
      }
    });

    it("rejects mismatched passwords", () => {
      const result = signUpSchema.safeParse({
        email: "user@company.com",
        password: "Abcd12@#",
        confirmPassword: "Abcd12$*",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe("Passwords do not match");
        expect(result.error.issues[0]?.path).toEqual(["confirmPassword"]);
      }
    });
  });

  describe("otpSchema", () => {
    it("accepts valid 6-digit numeric codes", () => {
      const result = otpSchema.safeParse({ code: "123456" });
      expect(result.success).toBe(true);
    });

    it("rejects non-numeric codes", () => {
      const result = otpSchema.safeParse({ code: "12345a" });
      expect(result.success).toBe(false);
    });

    it("rejects codes shorter than 6 digits", () => {
      const result = otpSchema.safeParse({ code: "12345" });
      expect(result.success).toBe(false);
    });

    it("rejects codes longer than 6 digits", () => {
      const result = otpSchema.safeParse({ code: "1234567" });
      expect(result.success).toBe(false);
    });
  });

  describe("backupCodeSchema", () => {
    it("accepts non-empty backup code strings", () => {
      const result = backupCodeSchema.safeParse({ code: "a1b2-c3d4-e5f6" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe("a1b2-c3d4-e5f6");
      }
    });

    it("rejects empty backup code", () => {
      const result = backupCodeSchema.safeParse({ code: "   " });
      expect(result.success).toBe(false);
    });
  });
});
