import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constant";
import { UserPayload } from "../utils/createToken";
import { Request, Response, NextFunction } from "express";
/**
 * Insert a UserPayload interface in the express request,
 * so that we can get the user authentication payload on any
 * part of the application;
 */
declare global {
  namespace Express {
    export interface Request {
      currentUser: UserPayload;
    }
  }
}

export const setUserPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentUser = req.cookies.jwt || req.headers["authorization"];

  console.log(currentUser);

  if (currentUser) {
    const user = jwt.verify(currentUser, JWT_SECRET);
    req.currentUser = user as UserPayload;
  }

  next();
};
