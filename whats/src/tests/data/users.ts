import { User } from "../../models/User";
import { userRepository } from "../../models";
import { makePassword } from "../../utils/password";

export const insertUsers = async () => {
  const arthur = new User();
  arthur.id = "124af2asf2b";
  arthur.username = "arthur";
  arthur.email = "arthur@gmail.com";
  arthur.password = await makePassword("batatinha");

  await userRepository.save(arthur);

  const jhon = new User();
  jhon.id = "1Ba3xZ2b";
  jhon.username = "jhon";
  jhon.email = "jhon@gmail.com";
  jhon.password = await makePassword("batatinha");

  await userRepository.save(jhon);

  const maria = new User();
  maria.id = "1B1xZ2b";
  maria.username = "maria";
  maria.email = "maria@gmail.com";
  maria.password = await makePassword("batatinha");

  await userRepository.save(maria);

  const elvis = new User();
  elvis.id = "124af22b";
  elvis.username = "elvis";
  elvis.email = "elvis@gmail.com";
  elvis.password = await makePassword("batatinha");

  await userRepository.save(elvis);
};
