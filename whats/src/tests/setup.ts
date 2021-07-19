import fs from "fs";
import { Connection } from "typeorm";
import { connect } from "../models";
import { UPLOAD_PATH } from "../utils/constant";

export let database: Connection;

beforeAll(async () => {
  database = await connect({ type: "sqlite", database: ":memory:" });
});

afterAll(async () => {
  if (database) {
    await database.close();
  }
});

/**
 * Função auxiliar para exlusão dos arquivos que são criados ao decorrer dos testes;
 *
 * @param filesBeforeTest Arquivos que já existiam antes de rodarem os testes
 */
const deleteCreatedTestFiles = (filesBeforeTest: string[]) => {
  fs.readdirSync(UPLOAD_PATH).forEach((fileName: string) => {
    if (!filesBeforeTest.includes(fileName)) {
      fs.unlinkSync(`${UPLOAD_PATH}/${fileName}`);
    }
  });
};

const FILES_BEFORE_TEST = fs.readdirSync(UPLOAD_PATH);

afterEach(() => deleteCreatedTestFiles(FILES_BEFORE_TEST));
