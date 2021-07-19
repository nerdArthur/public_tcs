import { SMTP_HOST, SMTP_USER, SMTP_PASS } from "../utils";

export const transporterOptions = {
  service: "gmail",
  host: SMTP_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER, // generated ethereal user
    pass: SMTP_PASS, // generated ethereal password
  },
  tls: { rejectUnauthorized: false },
};
