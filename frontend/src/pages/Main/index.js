import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import { api } from "../../api";
import styled from "styled-components";
import CampanhaTable from "../../components/CampanhaTable";
import RegistroTable from "../../components/RegistroTable";
import { useHistory } from "react-router";
import { isRegistryPath } from "../../routes";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const MainPage = () => {
  const history = useHistory();

  const [campanhas, setCampanhas] = useState({
    data: [],
    page: 0,
    totalCount: 5,
  });

  useEffect(() => {
    (async () => {
      try {
        const { data: result } = await api.get("/campanha", {
          headers: { authorization: localStorage.getItem("@tcc/jwt") },
        });

        console.log("RESULT", result);
        setCampanhas(result);
      } catch (err) {
        console.error(err.response + "\n" + err);
      }
    })();
  }, []);

  const handleClick = () => {
    history.push("/campanha");
  };

  return campanhas.length !== 0 ? (
    <Container>
      <NavBar />
      {isRegistryPath() ? <RegistroTable /> : <CampanhaTable />}
    </Container>
  ) : (
    <Container>
      <NavBar />
      <Card className="text-center">
        <Card.Header>Campanha</Card.Header>
        <Card.Body>
          <Card.Title>Você não possui campanhas</Card.Title>
          <Card.Text>
            Crie uma campanha para enviar mensagens automatizadas para seu
            cliente.
          </Card.Text>
          <Button variant="primary" onClick={handleClick}>
            Criar campanha
          </Button>
        </Card.Body>
        <Card.Footer className="text-muted"></Card.Footer>
      </Card>
    </Container>
  );
};

export default MainPage;
