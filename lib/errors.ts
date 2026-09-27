export type ErrorStatus = 400 | 401 | 403 | 404 | 500;

export class AuthenticationError extends Error {
  readonly status: ErrorStatus = 401;

  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ForbiddenError extends Error {
  readonly status: ErrorStatus = 403;

  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends Error {
  readonly status: ErrorStatus = 404;

  constructor(message: string = "Not found") {
    super(message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends Error {
  readonly status: ErrorStatus = 400;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    message: string = "Validation failed",
    fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProvisioningError extends Error {
  readonly status: ErrorStatus = 403;

  constructor(message: string = "User record not yet provisioned in database") {
    super(message);
    this.name = "ProvisioningError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProgrammerError extends Error {
  readonly status: ErrorStatus = 500;

  constructor(message: string = "Internal programmer error") {
    super(message);
    this.name = "ProgrammerError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
