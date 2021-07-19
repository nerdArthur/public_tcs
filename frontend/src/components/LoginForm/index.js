import { api } from "../../api";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useHistory } from "react-router-dom";

const FormWrapper = styled.div`
  padding: 3rem;
  border-radius: 5px;
  box-shadow: 0.25rem 0.25rem 0.25rem 0.25rem rgba(0, 0, 0, 0.1);
`;

export const LoginForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const history = useHistory();

  const [iserror, setIserror] = useState(false);
  const [alertHidden, setAlertHidden] = useState([false]);
  const [errorMessages, setErrorMessages] = useState([]);

  const onSubmit = async (evt) => {
    const data = {
      email: evt.email,
      password: evt.password,
    };

    api
      .post("/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ status, data: jwtToken }) => {
        if (status === 200) {
          localStorage.setItem("@tcc/jwt", jwtToken);
          history.push("/");
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
          Login
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
          {errors.email && <span>This field is required</span>}
        </Form.Group>

        <Form.Group controlId="formBasicPassworddco">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Senha"
            {...register("password")}
          />
          <Link to={"/forgotPassword"}>Esqueci minha senha</Link>
        </Form.Group>

        <Alert
          key={"1"}
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
          Entrar
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
          <Link to={"/sign"}>Criar Conta</Link>
        </Form.Text>
      </Form>
    </FormWrapper>
  );
};
