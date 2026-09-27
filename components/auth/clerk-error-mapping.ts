import type { UseFormSetError, FieldValues, Path } from "react-hook-form";

export interface ClerkError {
  code: string;
  message: string;
  longMessage?: string;
  meta?: {
    paramName?: string;
  };
}

const fieldMap: Record<string, string> = {
  identifier: "email",
  email_address: "email",
  password: "password",
  code: "code",
};

const emailCodes = new Set([
  "form_identifier_not_found",
  "form_identifier_exists",
  "form_param_format_invalid",
  "form_param_nil",
]);

const passwordCodes = new Set([
  "form_password_incorrect",
  "form_password_pwned",
  "form_password_length_too_short",
  "form_password_validation_failed",
]);

const codeCodes = new Set([
  "form_code_incorrect",
  "verification_expired",
  "verification_failed",
]);

/**
 * Maps Clerk API errors to React Hook Form field errors or form-level error state.
 *
 * @param errors - Array of Clerk error objects
 * @param setError - React Hook Form setError handler
 * @param setFormError - State setter for form-level error message
 */
export function mapClerkErrors<T extends FieldValues>(
  errors: ClerkError[],
  setError: UseFormSetError<T>,
  setFormError: (message: string | null) => void,
): void {
  if (!errors || errors.length === 0) {
    setFormError("Something went wrong. Please try again.");
    return;
  }

  let hasFormError = false;

  for (const err of errors) {
    const paramName = err.meta?.paramName;
    let targetField = paramName ? fieldMap[paramName] : undefined;

    if (!targetField) {
      if (emailCodes.has(err.code)) {
        targetField = "email";
      } else if (passwordCodes.has(err.code)) {
        targetField = "password";
      } else if (codeCodes.has(err.code)) {
        targetField = "code";
      }
    }

    if (targetField) {
      setError(targetField as Path<T>, {
        message: err.longMessage || err.message,
      });
    } else {
      setFormError(err.longMessage || err.message);
      hasFormError = true;
    }
  }

  if (!hasFormError) {
    setFormError(null);
  }
}
