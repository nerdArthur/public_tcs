import { Request, Response, Router } from "express";
import { userRepository } from "../../models";
import { authorization } from "../../middlewares/auth";

const router = Router();

router.delete("/user", authorization, async (req: Request, res: Response) => {
  const user = await userRepository.findOne(req.currentUser.sub);

  await userRepository.delete(user?.id!);

  res.status(204).send({});
});

export { router as deleteUserRouter };
