import { Router, Request, Response } from "express";
import { registroRepository } from "../../models";
import { Registro } from "../../models/Registro";

const router = Router();

router.put(
  "/campanha/:cdCampanha/registro/:id",
  async (req: Request, res: Response) => {
    const body: Registro = req.body;

    const { cdCampanha, id } = req.params;

    const registro = await registroRepository.findOne({
      where: {
        id,
        campanha: cdCampanha,
      },
    });

    const updatedRegistro = { ...registro, ...body };

    const response = await registroRepository.save(updatedRegistro);

    return res.status(204).send(response);
  }
);

export { router as updateRegistroRouter };
