import { notNull } from ".";
import { userRepository } from "../models";
import { User } from "../models/User";
import { createToken, UserPayload } from "./createToken";

export const useCookie = async (
  optionalPayload?: UserPayload,
  optionalUser?: User
) => {
  const user = await userRepository.findOne({
    where: { username: "arthur" },
  });

  const payload: UserPayload = {
    sub: optionalUser?.id || notNull(user).id,
    email: optionalUser?.email || notNull(user).email,
    ...optionalPayload,
  };

  const jwtCookie = "jwt=".concat(createToken(payload));

  return jwtCookie;
};
