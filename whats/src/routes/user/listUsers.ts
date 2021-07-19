import { Request, Response, Router } from "express";
import { userRepository } from "../../models";
import { authorization } from "../../middlewares/auth";

const router = Router();

router.get("/user", authorization, async (req: Request, res: Response) => {
  const { pageSize, page } = req.query;

  const users = await userRepository.find({
    take: Number(pageSize) || 4,
    skip: Number(page) || 0,
  });

  res.status(200).send(users);
});

export { router as listUsersRouter };
