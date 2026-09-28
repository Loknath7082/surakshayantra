import { describe, it, expect } from "vitest";
import {
  selectDefaultSecondFactor,
  extractAvailableStrategies,
} from "@/components/auth/sign-in-form";
import { otpSchema, backupCodeSchema } from "@/lib/validations/auth";

describe("MFA Second Factor Selection & Strategy Utilities", () => {
  describe("selectDefaultSecondFactor priority", () => {
    it("prefers TOTP when all methods are available", () => {
      const factors = [
        { strategy: "backup_code" },
        { strategy: "email_code", emailAddressId: "email_1" },
        { strategy: "phone_code", phoneNumberId: "phone_1" },
        { strategy: "totp" },
      ];
      const selected = selectDefaultSecondFactor(factors);
      expect(selected?.strategy).toBe("totp");
    });

    it("selects phone_code when TOTP is unavailable", () => {
      const factors = [
        { strategy: "backup_code" },
        { strategy: "email_code", emailAddressId: "email_1" },
        { strategy: "phone_code", phoneNumberId: "phone_1" },
      ];
      const selected = selectDefaultSecondFactor(factors);
      expect(selected?.strategy).toBe("phone_code");
      expect((selected as { phoneNumberId?: string })?.phoneNumberId).toBe("phone_1");
    });

    it("selects email_code when TOTP and phone_code are unavailable", () => {
      const factors = [
        { strategy: "backup_code" },
        { strategy: "email_code", emailAddressId: "email_1" },
      ];
      const selected = selectDefaultSecondFactor(factors);
      expect(selected?.strategy).toBe("email_code");
      expect((selected as { emailAddressId?: string })?.emailAddressId).toBe("email_1");
    });

    it("selects backup_code only when no other supported interactive method is present", () => {
      const factors = [{ strategy: "backup_code" }];
      const selected = selectDefaultSecondFactor(factors);
      expect(selected?.strategy).toBe("backup_code");
    });

    it("returns undefined when factors list is empty or contains only unsupported strategies", () => {
      expect(selectDefaultSecondFactor([])).toBeUndefined();
      expect(
        selectDefaultSecondFactor([{ strategy: "unsupported_custom_mfa" }])
      ).toBeUndefined();
    });
  });

  describe("extractAvailableStrategies", () => {
    it("extracts all valid supported second factors in list", () => {
      const factors = [
        { strategy: "totp" },
        { strategy: "phone_code" },
        { strategy: "backup_code" },
        { strategy: "unknown_future_factor" },
      ];
      const available = extractAvailableStrategies(factors);
      expect(available).toEqual(["totp", "phone_code", "backup_code"]);
      expect(available).not.toContain("unknown_future_factor");
    });
  });

  describe("Validation schema switching between standard OTP and Backup Codes", () => {
    it("validates 6-digit numeric OTP for TOTP/SMS/Email", () => {
      expect(otpSchema.safeParse({ code: "123456" }).success).toBe(true);
      expect(otpSchema.safeParse({ code: "12345" }).success).toBe(false);
      expect(otpSchema.safeParse({ code: "1234567" }).success).toBe(false);
      expect(otpSchema.safeParse({ code: "abcdef" }).success).toBe(false);
    });

    it("validates alphanumeric format for emergency backup recovery codes", () => {
      expect(backupCodeSchema.safeParse({ code: "1a2b-3c4d-5e6f" }).success).toBe(true);
      expect(backupCodeSchema.safeParse({ code: "ABCDEF123456" }).success).toBe(true);
      expect(backupCodeSchema.safeParse({ code: "" }).success).toBe(false);
      expect(backupCodeSchema.safeParse({ code: "   " }).success).toBe(false);
    });
  });
});
