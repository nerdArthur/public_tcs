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

export const ChangePasswordForm = () => {
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
      password: evt.password,
      confirmPassword: evt.confirmPassword,
    };

    const jwt = localStorage.getItem("@tcc/jwt");

    if (data.password !== data.confirmPassword) {
      setErrorMessages(["As senhas não estão iguais"]);
      setAlertHidden(false);
      setIserror(true);
    } else {
      api
        .post("/changePassword", data, {
          headers: {
            "Content-Type": "application/json",
            authorization: jwt,
          },
        })
        .then(({ status }) => {
          if (status === 204) {
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
          Mudar senha
        </h1>
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
        ></Form.Text>
      </Form>
    </FormWrapper>
  );
};
