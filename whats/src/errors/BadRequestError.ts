import ApplicationError from "./ApplicationError";

class BadRequestError extends ApplicationError {
  errors?: string[] | undefined;
  status = 400;

  constructor(message: string) {
    super();

    this.errors = [message || "Bad Request"];
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export default BadRequestError;
