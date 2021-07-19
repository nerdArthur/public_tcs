abstract class ApplicationError extends Error {
  abstract status: number;
  abstract errors?: string[];

  constructor(message?: string) {
    super(message);

    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

export default ApplicationError;
