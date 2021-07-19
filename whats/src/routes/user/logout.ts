import { Request, Response, Router } from "express";

const router = Router();

router.post("/logout", async (req: Request, res: Response) => {
  res.clearCookie("jwt");

  if (req.headers["authorization"]) {
    res.removeHeader("authorization");
  }

  res.status(200).send({ ok: true });
});

export { router as logoutRouter };
