import fs from "fs";
import path from "path";
import { app } from "../app";
import request from "supertest";
import { it, expect, describe } from "@jest/globals";
import { useData } from "../tests/data";
import { useCookie } from "../utils/defaultCookie";

describe("deve fazer a verificação e validação dos arquivos informados", () => {
  const ARQUIVO_COM_EXTENSAO_NAO_ESPERADA = fs.readFileSync(
    path.resolve(__dirname, "..", "tests", "files", "c55d8113-6.xlsxz")
  );

  const ARQUIVO_MIMETYPE_NAO_ESPERADO = fs.readFileSync(
    path.resolve(__dirname, "..", "tests", "files", "txt.xls")
  );

  const ARQUIVO_XLS_VALIDO = fs.readFileSync(
    path.resolve(__dirname, "..", "tests", "files", "VALID_XLS.xlsx")
  );

  const UPLOAD_DIR = path.resolve(__dirname, "..", "..", "uploads");

  fit("deve retornar um erro caso arquivo não seja informado", async () => {
    await useData(["user"]);

    const res = await request(app)
      .post("/whats/upload/campanha")
      .set("Cookie", await useCookie());

    const expectedMessage = "Arquivos não informados";

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual([expectedMessage]);
  });

  it("deve retornar erro caso o arquivo tenha uma extensão não esperada", async () => {
    await useData(["user"]);

    const expectedExtensions = ["csv", "xls", "xlsx"];
    const fileExtension = path.extname(
      path.resolve(__dirname, "..", "tests", "files", "c55d8113-6.xlsxz")
    );

    const isExpectedExtension = expectedExtensions.includes(fileExtension);
    expect(isExpectedExtension).toBe(false);

    const res = await request(app)
      .post("/whats/upload/campanha")
      .set("Cookie", await useCookie())
      .attach("files", ARQUIVO_COM_EXTENSAO_NAO_ESPERADA);

    console.log(res.body);

    const expectedMessage = "Extensão do arquivo inválida";

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(expectedMessage);
  });

  it("deve fazer o upload de um arquivo", async () => {
    const uploadDirLengthBefore = fs.readdirSync(UPLOAD_DIR).length;

    const res = await request(app)
      .post("//upload")
      .attach("files", ARQUIVO_XLS_VALIDO);

    const uploadDirLengthAfterUpload = fs.readdirSync(UPLOAD_DIR).length;

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ok: true });
    expect(uploadDirLengthBefore).toBeLessThan(uploadDirLengthAfterUpload);
  });

  it("deve retornar erro caso o arquivo tenha um mimetype não esperado", async () => {
    const expectedMimetypes = [
      "text/csv",
      "application/pdf",
      "application/xml",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const notAllowedMimeType = "application/octet-stream";
    expect(expectedMimetypes.includes(notAllowedMimeType)).toBe(false);

    const res = await request(app)
      .post("/upload")
      .attach("files", ARQUIVO_MIMETYPE_NAO_ESPERADO, {
        contentType: notAllowedMimeType,
      });

    const expectedMessage = "Tipo de arquivo inválido";

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(expectedMessage);
  });
});

it("deve retornar erro caso a planilha não ou csv seja informado", async () => {
  const BOLETO_PDF = path.resolve(
    __dirname,
    "..",
    "tests",
    "files",
    "2aVia-CotaUnica.pdf"
  );

  const res = await request(app).post("//upload").attach("files", BOLETO_PDF, {
    contentType: "application/pdf",
  });

  const expectedMessage = "Tipo de arquivo inválido";

  expect(res.status).toBe(400);
  expect(res.body.message).toEqual(expectedMessage);
});
