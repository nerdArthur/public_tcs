import path from "path";
import { createConnection, Repository, ConnectionOptions } from "typeorm";
import { getRepository } from "typeorm";
import { Campanha } from "./Campanha";
import { Token } from "./Token";
import { Registro } from "./Registro";
import { User } from "./User";

export let userRepository: Repository<User>;
export let tokenRepository: Repository<Token>;
export let campanhaRepository: Repository<Campanha>;
export let registroRepository: Repository<Registro>;

export const connect = async (options: ConnectionOptions) => {
  const database = await createConnection({
    synchronize: true,
    logging: false,
    entities: [User, Token, Campanha, Registro],
    migrationsRun: true,
    migrations: [path.resolve(__dirname, "..", "migrations")],
    ...options,
  });

  userRepository = getRepository(User);
  tokenRepository = getRepository(Token);
  campanhaRepository = getRepository(Campanha);
  registroRepository = getRepository(Registro);

  return database;
};
