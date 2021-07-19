import { Request, Response, Router } from "express";
import BadRequestError from "../../errors/BadRequestError";
import bcrypt from "bcrypt";
import { tokenRepository, userRepository } from "../../models";
import { body, query } from "express-validator";
import { validateRequest } from "../../middlewares/validationHandler";

const router = Router();

router.post(
  "/resetPassword",
  [
    query("token").notEmpty().withMessage("Token vazio"),
    body("password").notEmpty().withMessage("Senha vazia"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("A senha deve conter pelo menos 8 caracteres"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { password } = req.body;
    const { token } = req.query;

    const tokenObject = await tokenRepository.findOne({
      where: {
        token,
      },
    });

    if (!tokenObject) {
      throw new BadRequestError("Token inexistente");
    }

    if (tokenObject?.expirationDate < new Date()) {
      throw new BadRequestError("Token expirado");
    }

    const user = await userRepository.findOne({ id: tokenObject.cdUser });

    user!.password = await bcrypt.hash(password, 10);

    await userRepository.save(user!);

    await tokenRepository.delete(tokenObject.id);

    res.status(204).send();
  }
);

export { router as resetPasswordRouter };
