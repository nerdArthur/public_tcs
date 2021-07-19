import { config } from "dotenv";
import * as env from "env-var";
import path from "path";

// Environment variables
config({ path: path.resolve(__dirname, "..", "..", ".env") });

process.env.NODE_ENV == "development" &&
  config({ path: path.resolve(__dirname, "..", ".env.test") });

export const UPLOAD_PATH = path.resolve(__dirname, "..", "..", "uploads");

export const JWT_SECRET = env.get("JWT_SECRET").required(true).asString();

export const DB_HOST = env.get("DB_HOST").required(false).asString();

export const DB_URL = env.get("DB_URL").required(true).asString();

export const SERVER_PORT = env
  .get("SERVER_PORT")
  .required(true)
  .default(3000)
  .asPortNumber();

// Email for test (Google Drive API)
export const GMAIL_ACCOUNT = env.get("GMAIL_ACCOUNT").required(true).asString();
export const GMAIL_PASSWORD = env
  .get("GMAIL_PASSWORD")
  .required(true)
  .asString();

export const SMTP_PORT = env.get("SMTP_PORT").required(true).asPortNumber();
export const SMTP_HOST = env.get("SMTP_HOST").required(true).asString();
export const SMTP_USER = env.get("SMTP_USER").required(true).asString();
export const SMTP_PASS = env.get("SMTP_PASS").required(true).asString();

export const BRASIL_DDD = 55;
export const FIRST_AREA_CODE = 11;
export const LAST_AREA_CODE = 99;

export const INTERVAL_TASK_TIMER = 10 * 1000;
