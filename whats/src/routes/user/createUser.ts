import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validationHandler";
import { User } from "../../models/User";
import { hash } from "bcrypt";
import { userRepository } from "../../models";
import { createToken, UserPayload } from "../../utils/createToken";
import { v4 as uuid } from "uuid";
import BadRequestError from "../../errors/BadRequestError";

const router = Router();

router.post(
  "/user",
  [
    body("username").notEmpty().withMessage("Usuário vazio"),
    body("username")
      .optional()
      .isLength({ min: 3 })
      .withMessage("O nome de usuário deve conter pelo menos 3 caracteres"),
    body("email").notEmpty().withMessage("E-mail vazio"),
    body("email").isEmail().withMessage("E-mail inválido"),
    body("password").notEmpty().withMessage("Senha vazia"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("A senha deve conter pelo menos 8 caracteres"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const emailAlreadyExists =
      (await userRepository.count({ where: { email } })) > 0;

    if (emailAlreadyExists) {
      throw new BadRequestError("Este e-mail já existe");
    }

    const usernameAlreadyExists =
      (await userRepository.count({
        where: { username },
      })) > 0;

    if (usernameAlreadyExists) {
      throw new BadRequestError("Este usuário já existe");
    }

    const user = new User();
    user.id = uuid();
    user.username = username;
    user.email = email;
    user.password = await hash(password, 10);

    await userRepository.save(user);

    const payload: UserPayload = {
      sub: user.id,
      email,
    };

    const jwtCookie = createToken(payload);
    res.cookie("jwt", jwtCookie);

    res.status(201).send({ ...user, token: jwtCookie });
  }
);

export { router as createUserRouter };
