import request from "supertest";
import { useData } from "../../tests/data";
import { app } from "../../app";
import { userRepository } from "../../models";

it("deve retornar um array contendo todos os erros", async () => {
  const res = await request(app).post("/whats/user");

  expect(res.body.errors.length > 0).toBe(true);

  expect(res.status).toBe(400);

  expect(res.body.errors).toEqual([
    "Usuário vazio",
    "E-mail vazio",
    "E-mail inválido",
    "Senha vazia",
    "A senha deve conter pelo menos 8 caracteres",
  ]);
});

it("caso email já exista, deve lançar Bad Request", async () => {
  await useData(["user"]);

  const EXISTING_EMAIL = "arthur@gmail.com";

  const requestBody = {
    username: "batatinha",
    password: "batatinha",
    email: EXISTING_EMAIL,
  };

  const user = await userRepository.findOne({
    where: { email: EXISTING_EMAIL },
  });
  expect(user).toBeDefined();

  const res = await request(app).post("/whats/user").send(requestBody);

  expect(res.status).toBe(400);
  expect(res.body.errors).toEqual(["Este e-mail já existe"]);
});

it("caso usuário já exista, deve lançar Bad Request", async () => {
  await useData(["user"]);

  const EXISTING_USERNAME = "arthur";

  const requestBody = {
    username: EXISTING_USERNAME,
    password: "batatinha",
    email: "batatinha@gmail.com",
  };

  const user = await userRepository.findOne({
    where: { username: EXISTING_USERNAME },
  });
  expect(user).toBeDefined();

  const res = await request(app).post("/whats/user").send(requestBody);

  expect(res.status).toBe(400);
  expect(res.body.errors).toEqual(["Este usuário já existe"]);
});

it("deve retornar um cookie contendo o usuário criado e o token\
de acesso para autorização", async () => {
  const requestBody = {
    username: "batatinha",
    password: "batatinha",
    email: "batatinha@gmail.com",
  };

  const res = await request(app).post("/whats/user").send(requestBody);

  expect(res.status).toBe(201);
  expect(res.body.token).toBeDefined();
  expect(res.body.id).toBeDefined();
  expect(res.body.email).toEqual(requestBody.email);
  expect(res.body.username).toEqual(requestBody.username);
});
