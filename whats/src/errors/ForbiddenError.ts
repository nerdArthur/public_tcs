import ApplicationError from "./ApplicationError";

class ForbiddenError extends ApplicationError {
  errors?: string[] | undefined;
  status = 403;

  constructor(message?: string) {
    super();

    this.errors = [message || "Forbidden"];

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export default ForbiddenError;
