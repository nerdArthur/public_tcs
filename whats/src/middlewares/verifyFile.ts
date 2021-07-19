import BadRequestError from "../errors/BadRequestError";
import { Request, Response, NextFunction } from "express";
import fs from "fs";

export const customFileFilter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.files);

  try {
    if (req.file) {
      const { path } = req.file;

      const file = fs.openSync(path, "r");

      const FIRST_FOUR_BYTES = 4;
      const buffer = Buffer.alloc(FIRST_FOUR_BYTES);

      const isValidFileType = fs.readSync(file, buffer, {
        length: FIRST_FOUR_BYTES,
      });

      if (!isValidFileType) {
        throw new BadRequestError("Invalid file type");
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: { message: "Invalid file type" } });
  }

  next();
};
