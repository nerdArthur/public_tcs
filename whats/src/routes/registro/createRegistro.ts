import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { campanhaRepository, registroRepository } from "../../models";
import { Registro } from "../../models/Registro";

const router = Router();

router.post("/campanha/:id/registro", async (req: Request, res: Response) => {
  const body: Registro = req.body;

  const campanhaId = req.params.id;

  const campanha = await campanhaRepository.findOne(campanhaId);

  const registro = await registroRepository.save({
    ...body,
    id: uuid(),
    campanha,
  });

  return res.status(201).send(registro);
});

export { router as createRegistroRouter };
