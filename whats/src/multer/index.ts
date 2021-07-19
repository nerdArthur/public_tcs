import path from "path";
import multer from "multer";
import { UPLOAD_PATH } from "../utils/constant";
import BadRequestError from "../errors/BadRequestError";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const { ext: extensionName } = path.parse(file.originalname);

  const acceptedExtensions = /(csv|xls|xlsx|pdf)$/gm;
  if (!acceptedExtensions.test(extensionName)) {
    cb(null, false);
    return cb(new BadRequestError("Extensão do arquivo inválida"));
  }

  const { mimetype } = file;

  const allowedMimetypes = [
    "text/csv",
    "application/pdf",
    "application/xml",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (!allowedMimetypes.includes(mimetype)) {
    cb(null, false);
    return cb(new BadRequestError("Tipo de arquivo inválido"));
  }

  cb(null, true);
};
