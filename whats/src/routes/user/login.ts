import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validationHandler";
import { compare } from "bcrypt";
import { userRepository } from "../../models";
import BadRequestError from "../../errors/BadRequestError";
import ForbiddenError from "../../errors/ForbiddenError";
import { createToken, UserPayload } from "../../utils/createToken";

const router = Router();

router.post(
  "/login",
  [
    body("email").notEmpty().withMessage("E-mail vazio"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Senha vazia"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ email });

    if (!user) {
      throw new BadRequestError("Usuário inexistente");
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      throw new ForbiddenError("Senha incorreta");
    }

    const payload: UserPayload = {
      sub: user.id,
      email,
    };

    const jwtCookie = createToken(payload);
    res.cookie("jwt", jwtCookie);

    res.status(200).send(jwtCookie);
  }
);

export { router as loginRouter };
