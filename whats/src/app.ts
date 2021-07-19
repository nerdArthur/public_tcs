import cors from "cors";
import "express-async-errors";
import { json } from "body-parser";
import NotFoundError from "./errors/NotFoundError";
import { errorHandler } from "./middlewares/errorHandler";
import express, { Request, Response, urlencoded } from "express";
import cookieParser from "cookie-parser";
import { setUserPayload } from "./middlewares/requestPayload";
import { routes } from "./routes";

const app = express();

// set the configuration middlewares of the application
app.set("trust proxy", true);
app.use(cors({ credentials: true, origin: "*" }));
app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// define user payload from request jwt headers or cookies
app.use(setUserPayload);

// routers of the application
app.use("/whats", routes);

// all undefined routes will thrown an not found error
app.all("*", (req: Request, res: Response) => {
  throw new NotFoundError();
});

// the error handler of the application
// must be the last middleware of the app
app.use(errorHandler);

export { app };
