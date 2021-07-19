import { Router, Request, Response } from "express";
import { registroRepository } from "../../models";

const router = Router();

router.get(
  "/campanha/:cdCampanha/registro/:id",
  async (req: Request, res: Response) => {
    const { cdCampanha, id } = req.params;

    const registro = await registroRepository.findOne({
      where: { id, campanha: cdCampanha },
    });

    return res.status(200).send(registro);
  }
);

export { router as getRegistroRouter };
