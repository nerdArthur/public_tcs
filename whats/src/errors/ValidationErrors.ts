import { Result, ValidationError } from "express-validator";
import ApplicationError from "./ApplicationError";

class ValidationErrors extends ApplicationError {
  errors?: string[] | undefined;
  status = 400;

  constructor(result: Result<ValidationError>) {
    super();

    this.errors = result.array().map((error) => error.msg);
    Object.setPrototypeOf(this, ValidationErrors.prototype);
  }
}

export default ValidationErrors;
