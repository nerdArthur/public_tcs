import multer from "multer";
import { v4 as uuid } from "uuid";
import { storage, fileFilter } from "../multer";
import { Request, Response, Router } from "express";
import EventEmitter from "events";
import { readFile } from "fs/promises";
import { xlsToCsv } from "../xls";

import BadRequestError from "../errors/BadRequestError";
import { Campanha, CampanhaStatus } from "../models/Campanha";
import { userRepository } from "../models";
import {
  ID,
  NOME_DESTINATARIO,
  NOME_DO_ARQUIVO_OU_LINK,
  Row,
  TELEFONE_DESTINATARIO,
} from "../xls/xlsTypes";
import { Registro, StatusRegistro } from "../models/Registro";
import { validateColumns } from "../xls/validations";
import { makeTransaction } from "../utils/transaction";
import { EntityManager } from "typeorm";
import { authorization } from "../middlewares/auth";

const router = Router();

router.post(
  "/upload/campanha",
  authorization,
  multer({ storage, fileFilter }).fields([
    { name: "worksheet", maxCount: 1 },
    { name: "files", maxCount: 10 },
  ]),
  async (req: Request, res: Response) => {
    if (!req.files) {
      throw new BadRequestError("Arquivos não informados");
    }

    const files = Object.setPrototypeOf(req.files, Object.prototype).files;

    const worksheetOrCsv: Express.Multer.File = files.find(
      (file: Express.Multer.File) => {
        return /\.(xls|xlsx|csv|txt)/g.test(file.originalname);
      }
    );

    if (!worksheetOrCsv) {
      throw new BadRequestError("Planilha não informada");
    }

    const currentUser = req.currentUser;

    const user = await userRepository.findOne(currentUser.sub);

    const contentType = /\.(xls|xlsx)$/g.test(worksheetOrCsv.originalname)
      ? "xls"
      : "csv";

    let csv: string;
    if (contentType === "xls") {
      // const fileBuffer = await fs.readFile(worksheetOrCsv.path);
      csv = xlsToCsv(worksheetOrCsv.path);

      console.log("csv", csv);
    } else {
      csv = (await readFile(worksheetOrCsv.path)).toString("utf8");
    }

    //chamar as validações do xls/csv, passando o eventEmitter como parâmetro
    const eventEmitter: EventEmitter = req.app.get("eventEmitter");

    // passar o emmiter para as validações para podermos passar os status das linhas
    // validate rows
    const rows = csv.split(/\n/gm);

    const containsHeader = /Cod Contrato\/Cod no Sistema/gim.test(rows[0]);
    if (containsHeader) {
      rows.shift();
    }

    const allRows: Row[] = [];
    const rowsWithErrors: Row[] = [];
    const rowsWithoutErrors: Row[] = [];

    let campanha;

    await makeTransaction(async (em: EntityManager) => {
      const registroRepository = em.getRepository(Registro);
      const campanhaRepository = em.getRepository(Campanha);

      campanha = await campanhaRepository.save({
        id: uuid(),
        name: req.body.name,
        user: user,
        status: CampanhaStatus.CRIADA,
      });

      // cria os registros (linhas) que compõem a campanha
      for (let index = 0; index < rows.length; index++) {
        const row = rows[index];
        const columns = row.split(/,/gm);
        if (row.trim().length === 0) {
          continue;
        }

        const line: Row = await validateColumns(columns, index);

        if (line.hasErrors) {
          rowsWithErrors.push(line);
        } else {
          rowsWithoutErrors.push(line);
        }

        // criar registro para linha válida
        const registro = new Registro();
        registro.campanha = campanha;
        registro.id = uuid();
        registro.linha = line.line;

        registro.cdLinha = columns[ID];
        registro.nomeDestinatario = columns[NOME_DESTINATARIO] || "";
        registro.telefoneDestinatario = columns[TELEFONE_DESTINATARIO] || "";
        registro.arquivoOuLink = columns[NOME_DO_ARQUIVO_OU_LINK] || "";
        registro.status = StatusRegistro.INATIVO;

        await registroRepository.save(registro);

        eventEmitter.emit("msg", line);
        allRows.push(line);
      }
    });

    campanha ? res.status(201).send({}) : res.status(400);
  }
);

export { router as uploadRouter };
