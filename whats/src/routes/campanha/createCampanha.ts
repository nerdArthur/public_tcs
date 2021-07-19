import { Router, Request, Response } from "express";
import { campanhaRepository, userRepository } from "../../models";
import { v4 as uuid } from "uuid";
import { CampanhaStatus } from "../../models/Campanha";
import { authorization } from "../../middlewares/auth";
const router = Router();

router.post("/campanha", authorization, async (req: Request, res: Response) => {
  const currentUser = req.currentUser;

  const user = await userRepository.findOne(currentUser.sub);

  const campanha = await campanhaRepository.save({
    id: uuid(),
    name: req.body.name,
    user: user,
    status: CampanhaStatus.CRIADA,
  });

  res.status(201).send(campanha);
});

export { router as createCampanhaRouter };
