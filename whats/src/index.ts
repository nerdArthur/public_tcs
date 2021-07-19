import "reflect-metadata";
import "express-async-errors";
const venom = require("venom-bot");
import { create } from "venom-bot";
import path from "path";
import http from "http";
import { app } from "./app";
import { config } from "dotenv";
import { connect } from "./models";
import { Connection } from "typeorm";
import { createEventEmitter } from "./utils/eventEmitter";
import { DB_URL, INTERVAL_TASK_TIMER, SERVER_PORT } from "./utils/constant";
import { Whatsapp } from "venom-bot";
import { startVenom } from "./whats";
import { options } from "./configs/whatsConfig";
import { updateStatusTimer } from "./utils/updateStatusTimer";

config({ path: path.resolve(__dirname, "..", ".env") });

process.env.NODE_ENV == "development" &&
  config({ path: path.resolve(__dirname, "..", ".env.test") });

let database: Connection;
let httpServer: http.Server;
let whatsapp: Whatsapp;
let interval: NodeJS.Timeout;

const start = async () => {
  try {
    database = await connect({
      type: "mysql",
      url: DB_URL,
    });
  } catch (err) {
    console.log("Error initializing the database\n" + err);
    await finish();
  }

  try {
    httpServer = http.createServer(app);
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server listening on port ${SERVER_PORT}`);
    });
  } catch (err) {
    console.error("Error initializing the http server\n" + err);
    await finish();
  }

  try {
    process.env.NODE_ENV == "development"
      ? (whatsapp = await venom.create())
      : (whatsapp = await create(options));

    await startVenom(whatsapp);
  } catch (err) {
    console.error("Error initializing the whatsapp bot:\n" + err);
    await finish();
  }

  try {
    interval = setInterval(
      async () => await updateStatusTimer(),
      INTERVAL_TASK_TIMER
    );
  } catch (err) {
    console.error("Error during status update timer:\n" + err);
    await finish();
  }

  const eventEmitter = createEventEmitter(whatsapp);
  app.set("eventEmitter", eventEmitter);
};

const finish = async () => {
  try {
    if (database) {
      await database.close();
    }
  } catch (err) {
    console.error("Error closing the database\n" + err);
  }

  try {
    clearInterval(interval);
  } catch (err) {
    console.error("Error during status update timer:\n" + err);
  }

  process.exit();
};

(async () => await start())();
