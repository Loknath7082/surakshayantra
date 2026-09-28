import { describe, it, expect, vi } from "vitest";
import { mapClerkErrors, type ClerkError } from "@/components/auth/clerk-error-mapping";

describe("mapClerkErrors", () => {
  it("maps paramName=identifier to email field", () => {
    const setError = vi.fn();
    const setFormError = vi.fn();
    const errors: ClerkError[] = [
      {
        code: "form_identifier_not_found",
        message: "No user found with this email",
        meta: { paramName: "identifier" },
      },
    ];

    mapClerkErrors(errors, setError, setFormError);

    expect(setError).toHaveBeenCalledWith("email", {
      message: "No user found with this email",
    });
    expect(setFormError).toHaveBeenCalledWith(null);
  });

  it("maps paramName=email_address to email field", () => {
    const setError = vi.fn();
    const setFormError = vi.fn();
    const errors: ClerkError[] = [
      {
        code: "form_identifier_exists",
        message: "An account with this email already exists",
        meta: { paramName: "email_address" },
      },
    ];

    mapClerkErrors(errors, setError, setFormError);

    expect(setError).toHaveBeenCalledWith("email", {
      message: "An account with this email already exists",
    });
    expect(setFormError).toHaveBeenCalledWith(null);
  });

  it("maps password-related error codes to password field", () => {
    const setError = vi.fn();
    const setFormError = vi.fn();
    const errors: ClerkError[] = [
      {
        code: "form_password_incorrect",
        message: "Incorrect password",
      },
    ];

    mapClerkErrors(errors, setError, setFormError);

    expect(setError).toHaveBeenCalledWith("password", {
      message: "Incorrect password",
    });
    expect(setFormError).toHaveBeenCalledWith(null);
  });

  it("maps code-related error codes to code field", () => {
    const setError = vi.fn();
    const setFormError = vi.fn();
    const errors: ClerkError[] = [
      {
        code: "form_code_incorrect",
        message: "Incorrect verification code",
      },
    ];

    mapClerkErrors(errors, setError, setFormError);

    expect(setError).toHaveBeenCalledWith("code", {
      message: "Incorrect verification code",
    });
    expect(setFormError).toHaveBeenCalledWith(null);
  });

  it("sets formError for unrecognized error codes", () => {
    const setError = vi.fn();
    const setFormError = vi.fn();
    const errors: ClerkError[] = [
      {
        code: "session_limit_exceeded",
        message: "Too many active sessions",
      },
    ];

    mapClerkErrors(errors, setError, setFormError);

    expect(setError).not.toHaveBeenCalled();
    expect(setFormError).toHaveBeenCalledWith("Too many active sessions");
  });

  it("handles empty errors array gracefully", () => {
    const setError = vi.fn();
    const setFormError = vi.fn();

    mapClerkErrors([], setError, setFormError);

    expect(setError).not.toHaveBeenCalled();
    expect(setFormError).toHaveBeenCalledWith("Something went wrong. Please try again.");
  });
});
