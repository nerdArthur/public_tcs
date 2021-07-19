import { Router, Request, Response } from "express";
import { authorization } from "../../middlewares/auth";
import { campanhaRepository } from "../../models";

const router = Router();

router.get(
  "/campanha/:id",
  authorization,
  async (req: Request, res: Response) => {
    const campanha = await campanhaRepository.findOne(req.params.id);

    return res.status(200).send(campanha);
  }
);

export { router as getCampanhaRouter };
