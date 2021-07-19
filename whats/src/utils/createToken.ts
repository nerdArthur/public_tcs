import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./constant";

export const TWENTY_FOUR_HOURS = 60 * 1000 * 60 * 24;
export interface UserPayload {
  sub?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export const createToken = (data: UserPayload, options?: jwt.SignOptions) => {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: TWENTY_FOUR_HOURS,
    ...options,
  });
};
