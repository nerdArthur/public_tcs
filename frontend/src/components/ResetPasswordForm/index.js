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

export const ResetPasswordForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const history = useHistory();

  const [hidden, setHidden] = useState([true]);
  const [iserror, setIserror] = useState(false);
  const [alertHidden, setAlertHidden] = useState([false]);
  const [errorMessages, setErrorMessages] = useState([]);

  const onSubmit = async (evt) => {
    const data = {
      token: evt.token,
      password: evt.password,
    };

    if (evt.confirmPassword !== evt.password) {
      setErrorMessages(["As senhas não batem"]);
      setAlertHidden(false);
      setIserror(true);
    } else {
      if (!evt.token) {
        setErrorMessages(["Token não informado"]);
        setAlertHidden(false);
        setIserror(true);
      } else {
        api
          .post(`/resetPassword?token=${evt.token}`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(({ status }) => {
            console.log("STATUS", status);
            if (status === 204) {
              history.push("/");
            }
          })
          .catch((err) => {
            console.log("STATUS", err);
            setErrorMessages(
              !!err.response.data.errors
                ? [err.response.data.errors]
                : [err.response.data.message]
            );
            setAlertHidden(false);
            setIserror(true);
          });
      }
    }
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
          Recuperar senha
        </h1>
        <Form.Group controlId="formBasicPassworddco">
          <Form.Label>Código</Form.Label>
          <Form.Control
            type="text"
            placeholder="Token informado no email"
            {...register("token")}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassworddco">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Senha"
            {...register("password")}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassworddce">
          <Form.Label>Confirmação de Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Senha"
            {...register("confirmPassword")}
          />
        </Form.Group>

        <Alert
          key={"1"}
          variant={"danger"}
          hidden={alertHidden}
          onClose={() => setAlertHidden(true)}
          dismissible
        >
          {errorMessages[0] &&
            (errorMessages[0][0].length === 1
              ? errorMessages[0]
              : errorMessages[0].map((msg) => (
                  <>
                    {msg}
                    <br />
                  </>
                )))}
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
          <Link to={"/sign"}>Criar Conta</Link>
        </Form.Text>
      </Form>
    </FormWrapper>
  );
};
