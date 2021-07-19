import React from "react";
import { useForm } from "react-hook-form";
import { api } from "../../api";
import styled from "styled-components";

const Container = styled.div`
  padding: 3em;
  border-radius: 5px;
  margin-top: 5rem;
  box-shadow: 0.25rem 0.25rem 0.25rem 0.25rem rgba(0, 0, 0, 0.1);
`;

export default function CreateUserForm() {
  const { handleSubmit } = useForm();

  const onSubmit = async (data) => {
    console.log("DATA", data);
    const email = data.email;
    const username = data.username;
    const password = data.password;

    const { status: statusCode, data: resp } = await api.post(
      "/user",
      { username, email, password },
      {
        headers: { "content-type": "application/json" },
      }
    );

    console.log("AQUI, STATUS", statusCode, "RESP", resp);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" />
        </div>

        <div>
          <label htmlFor="username">Usuário:</label>
          <input id="username" type="text" />
        </div>

        <div>
          <label htmlFor="password">Senha:</label>
          <input id="password" type="password" />
        </div>

        <button type="submit">Enviar </button>
      </form>
    </Container>
  );
}
