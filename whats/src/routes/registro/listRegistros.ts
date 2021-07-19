import { Router, Request, Response } from "express";
import { registroRepository } from "../../models";
import { buildPagination } from "../../utils/pagination";

const router = Router();

router.get("/campanha/:id/registro", async (req: Request, res: Response) => {
  const paginatedResult = await buildPagination(req, registroRepository, {
    where: { campanha: req.params.id },
  });

  return res.status(200).send(paginatedResult);
});

export { router as listRegistrosRouter };
