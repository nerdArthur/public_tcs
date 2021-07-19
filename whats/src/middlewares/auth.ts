import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/constant";
import ForbiddenError from "../errors/ForbiddenError";
import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../errors/UnauthorizedError";
import BadRequestError from "../errors/BadRequestError";

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.currentUser;

  if (user) {
    return next();
  }

  const authorizationHeader = req.headers["authorization"];
  const jwtCookie = req.cookies.jwt;

  if (!jwtCookie && !authorizationHeader) {
    throw new UnauthorizedError("Não possui autorização");
  }

  if (authorizationHeader) {
    if (!authorizationHeader) {
      throw new UnauthorizedError("Não possui o header authorization");
    }

    const [bearer, token] = authorizationHeader.split(/\s/g);

    if (!/^Bearer/gim.test(bearer)) {
      throw new UnauthorizedError("Bearer token não informado");
    }

    const isFormattedToken = token.split(/\./gm).length === 3;

    if (!isFormattedToken) {
      throw new ForbiddenError("Token jwt mal formatado");
    }
    const isValidToken = jwt.verify(token, JWT_SECRET);

    if (!isValidToken) {
      throw new UnauthorizedError("Bearer token invalido");
    }
  } else {
    const isValidJwt = jwt.verify(jwtCookie, JWT_SECRET);
    if (!isValidJwt) {
      throw new UnauthorizedError("Token jwt inválido");
    }
  }

  next();
};

export const changePasswordAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    const { token } = req.query;

    if (!token) {
      throw new BadRequestError("Token não informado");
    }

    next();
  }
};
