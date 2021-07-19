import { Request, Response, Router } from "express";
import BadRequestError from "../../errors/BadRequestError";
import crypto from "crypto";
import { sendMail } from "../../mail";
import { tokenRepository, userRepository } from "../../models";
import { Token } from "../../models/Token";
import { v4 as uuid } from "uuid";

const router = Router();

router.post("/forgotPassword", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Email não informado");
  }

  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    throw new BadRequestError("Usuário inexistente");
  }

  const now = new Date();
  const THIRTY_MINUTS = 60 * 1000 * 30;
  const expirationDate = new Date(now.getTime() + THIRTY_MINUTS);

  const hash = crypto.randomBytes(20).toString("hex");

  const token: Token = {
    id: uuid(),
    cdUser: user.id,
    token: hash,
    expirationDate,
  };

  await sendMail({
    to: user.email,
    html: `<p>Token para recuperação de senha:<br /> <b>${hash}</b></p>`,
  });

  await tokenRepository.save(token);

  res.status(200).send({ ok: true });
});

export { router as forgotPasswordRouter };
