const path = require("path");
const CONSTANTS_PATH = path.resolve(__dirname, "build", "utils", "constant");
const { DB_URL } = require(CONSTANTS_PATH);

module.exports = {
  type: "mysql",
  url: DB_URL,
  synchronize: false,
  logging: false,
  entities: ["build/models/**/*.js"],
  migrations: ["build/migrations/**/*.js"],
  cli: {
    entitiesDir: "src/models",
    migrationsDir: "src/migrations",
  },
};
