import React, { useState } from "react";
import { api } from "../../api";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const FormWrapper = styled.div`
  padding: 3rem;
  border-radius: 5px;
  box-shadow: 0.25rem 0.25rem 0.25rem 0.25rem rgba(0, 0, 0, 0.1);
`;

export const SignForm = () => {
  const { handleSubmit, register } = useForm();

  const [iserror, setIserror] = useState(false);
  const [alertHidden, setAlertHidden] = useState([false]);
  const [errorMessages, setErrorMessages] = useState([]);

  const history = useHistory();

  const onSubmit = async (evt) => {
    const data = {
      email: evt.email,
      username: evt.username,
      password: evt.password,
    };

    api
      .post("/user", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ status, data: jwtToken }) => {
        if (status === 201) {
          history.push("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        setErrorMessages(
          !!err.response.data.errors
            ? [err.response.data.errors]
            : [err.response.data.message]
        );
        setAlertHidden(false);
        setIserror(true);
      });
  };

  return (
    <FormWrapper>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h1
          style={{
            textAlign: "center",
            color: "#212529",
            fontSize: "1.625rem",
            marginBottom: "1em",
            fontFamily: "serif",
          }}
        >
          Cadastro
        </h1>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Insira o email"
            {...register("email")}
          />
          <Form.Text className="text-muted">
            Nós nunca iremos compartilhar seu email com ninguém.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasiUsuario">
          <Form.Label>Usuário</Form.Label>
          <Form.Control
            type="text"
            min="3"
            placeholder="Insira o usuário"
            {...register("username")}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Senha"
            {...register("password")}
          />
        </Form.Group>

        <Alert
          key={"5"}
          variant={"danger"}
          hidden={alertHidden}
          onClose={() => setAlertHidden(true)}
          dismissible
        >
          {errorMessages[0] &&
            errorMessages[0].map((msg) => (
              <>
                {msg}
                <br />
              </>
            ))}
        </Alert>

        <Button
          variant="primary"
          type="submit"
          style={{ float: "right", marginTop: "1em" }}
        >
          Enviar
        </Button>
        <Form.Text
          className="text-muted"
          color="blue"
          style={{
            float: "left",
            fontSize: "1em",
            marginTop: "1.5em",
          }}
        >
          <Link to={"/login"}>Realizar login</Link>
        </Form.Text>
      </Form>
    </FormWrapper>
  );
};
