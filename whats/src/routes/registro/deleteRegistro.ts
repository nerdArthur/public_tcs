import { Router, Request, Response } from "express";
import BadRequestError from "../../errors/BadRequestError";
import { registroRepository } from "../../models";
import { Registro } from "../../models/Registro";

const router = Router();

router.delete(
  "/campanha/:cdCampanha/registro/:id",
  async (req: Request, res: Response) => {
    const body: Registro = req.body;

    const { cdCampanha, id } = req.params;
    console.log("AQUI", id);

    const registro = await registroRepository.findOne({
      where: {
        id,
        campanha: cdCampanha,
      },
    });

    if (!registro) {
      throw new BadRequestError("Registro inexistente");
    }

    if (registro) {
      await registroRepository.delete(registro);
    }

    return res.status(204).send({ ok: true });
  }
);

export { router as deleteRegistroRouter };
