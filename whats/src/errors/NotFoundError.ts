import ApplicationError from "./ApplicationError";

class NotFoundError extends ApplicationError {
  errors?: string[] | undefined;
  status = 404;

  constructor(message?: string) {
    super();

    this.errors = [message || "Not found"];

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export default NotFoundError;
