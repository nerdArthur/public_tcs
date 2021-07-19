import ApplicationError from "./ApplicationError";

class UnauthorizedError extends ApplicationError {
  errors?: string[] | undefined;
  status = 401;

  constructor(message?: string) {
    super();

    this.errors = [message || "Unauthorized"];

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export default UnauthorizedError;
