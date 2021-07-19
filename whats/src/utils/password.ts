import bcrypt from "bcrypt";

export const makePassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
