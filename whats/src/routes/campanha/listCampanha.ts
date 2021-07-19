import { Router, Request, Response } from "express";
import { authorization } from "../../middlewares/auth";
import { campanhaRepository } from "../../models";
import { buildPagination } from "../../utils/pagination";

const router = Router();

router.get("/campanha", authorization, async (req: Request, res: Response) => {
  const paginatedResult = await buildPagination(req, campanhaRepository);

  return res.status(200).send(paginatedResult);
});

export { router as listCampanhaRouter };
