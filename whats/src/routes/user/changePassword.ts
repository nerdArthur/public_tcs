import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { authorization } from "../../middlewares/auth";
import { userRepository } from "../../models";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validationHandler";

const router = Router();

router.post(
  "/changePassword",
  authorization,
  [
    body("password")
      .notEmpty({ ignore_whitespace: true })
      .withMessage("Senha vazia"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("A senha deve conter pelo menos 8 caracteres"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { password } = req.body;

    const currentUser = req.currentUser;

    const user = await userRepository.findOne({
      where: { email: currentUser.email },
    });

    user!.password = await bcrypt.hash(password, 10);
    await userRepository.save(user!);

    res.status(204).send();
  }
);

export { router as changePasswordRouter };
