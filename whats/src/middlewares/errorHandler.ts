import { NextFunction, Request, Response } from "express";
import ApplicationError from "../errors/ApplicationError";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV == "development") {
    console.log(error);
  }

  if (error instanceof ApplicationError) {
    return res.status(error.status).send(error);
  }

  res.status(500).send("Internal server error");
};
