import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ValidationErrors from "../errors/ValidationErrors";

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ValidationErrors(errors);
  }

  next();
};
