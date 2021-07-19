import React, { useState } from "react";
import { api } from "../../api";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { Form, Button, Spinner, ProgressBar } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const FormWrapper = styled.div`
  padding: 3rem;
  border-radius: 5px;
  box-shadow: 0.25rem 0.25rem 0.25rem 0.25rem rgba(0, 0, 0, 0.1);
`;

export const CampanhaForm = () => {
  const { register, handleSubmit, watch } = useForm();

  const [hidden, setHidden] = useState([true]);

  const history = useHistory();

  const onSubmit = async (data) => {
    setHidden(false);

    const formData = new FormData();
    for (const file of data.files) {
      // verificar se possui a planilha
      if (/\.(xls|xlsx|csv|txt)/g.test(data.name)) {
        formData.append("worksheet", file);
        continue;
      }

      formData.append("files", file);
    }

    formData.append("files", data.planilha);
    formData.append("name", data.nome);

    try {
      const jwt = localStorage.getItem("@tcc/jwt");

      await api.post("/upload/campanha", formData, {
        headers: {
          "content-type": "multipart/form-data",
          authorization: jwt,
        },
      });

      history.push("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  console.log(watch("files")); // watch input value by passing the name of it

  return (
    <Container>
      <NavBar />
      <FormWrapper>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Spinner animation="border" hidden={hidden} />

          <Form.Group controlId="formBasicText">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Insira o nome da campanha"
              {...register("nome", {
                required: "Required",
                min: 3,
                pattern: {
                  value: /\w{3,}/gi,
                  message: "Nome inválido",
                },
              })}
            />
          </Form.Group>
          <Form.Group controlId="formBasicFile">
            <Form.Label>Arquivos</Form.Label>
            <Form.File
              id="arquivos"
              label="Selecione os arquivos a serem enviados"
              multiple
              custom
              {...register("files")}
            />
            <Form.Text className="text-muted">
              Deve conter uma planilha com os registros da campanha.
              <br /> Caso haja arquivos adicionais, insira-os também.
            </Form.Text>
          </Form.Group>
          <Button type="submit">Enviar</Button>
        </Form>
      </FormWrapper>
    </Container>
  );
};
