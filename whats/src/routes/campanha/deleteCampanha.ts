import { Router, Request, Response, NextFunction } from "express";
import { campanhaRepository } from "../../models";
import { CampanhaStatus } from "../../models/Campanha";
import BadRequestError from "../../errors/BadRequestError";
import { authorization } from "../../middlewares/auth";
const router = Router();

router.delete(
  "/campanha/:id",
  authorization,
  async (req: Request, res: Response, next: NextFunction) => {
    const campanha = await campanhaRepository.findOne(req.params.id);

    if (!campanha) {
      throw new BadRequestError("Campanha inexistente");
    }

    const alreadyStartCampanha = campanha.status !== CampanhaStatus.CRIADA;

    if (alreadyStartCampanha) {
      throw new BadRequestError("Campanha já iniciada ou finalizada");
    }

    await campanhaRepository.delete(req.params.id);

    res.status(200).send({ ok: true });
  }
);

export { router as deleteCampanhaRouter };
