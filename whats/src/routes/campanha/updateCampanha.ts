import { Router, Request, Response } from "express";
import { campanhaRepository } from "../../models";
import { Campanha, CampanhaStatus } from "../../models/Campanha";
import BadRequestError from "../../errors/BadRequestError";
import { authorization } from "../../middlewares/auth";
const router = Router();

router.put(
  "/campanha/:id",
  authorization,
  async (req: Request, res: Response) => {
    const campanha = await campanhaRepository.findOne(req.params.id);
    const body: Campanha = req.body;

    if (!campanha) {
      throw new BadRequestError("Campanha inexistente");
    }

    const alreadyStartCampanha = campanha.status !== CampanhaStatus.CRIADA;

    if (alreadyStartCampanha) {
      throw new BadRequestError("Campanha já iniciada ou finalizada");
    }

    const updatedCampanha = { ...campanha, ...body };

    await campanhaRepository.save(updatedCampanha);

    res.status(204).send(updatedCampanha);
  }
);

export { router as updateCampanhaRouter };
