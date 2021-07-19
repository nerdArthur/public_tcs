import { Router, Request, Response } from "express";
import EventEmitter from "events";
import BadRequestError from "../../errors/BadRequestError";
import { campanhaRepository } from "../../models";
import { CampanhaStatus } from "../../models/Campanha";

const router = Router();

router.post("/whats/send/:cdCampanha", async (req: Request, res: Response) => {
  const { cdCampanha } = req.params;

  if (!cdCampanha) {
    throw new BadRequestError("Campanha não informada");
  }

  const campanha = await campanhaRepository.findOne(cdCampanha);

  if (!campanha) {
    throw new BadRequestError("Campanha inexistente");
  }

  if (!campanha.registros) {
    throw new BadRequestError("Campanha sem registros");
  }

  campanha.status = CampanhaStatus.INICIADA;
  await campanhaRepository.save(campanha);

  setTimeout(() => {
    const eventEmitter: EventEmitter = req.app.get("eventEmitter");
    eventEmitter.emit("start-campanha", campanha);
  }, 100);

  res.status(200).send({ ok: true });
});

export { router as whatsSendRouter };
