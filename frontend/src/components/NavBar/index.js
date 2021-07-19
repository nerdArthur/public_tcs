import React from "react";
import { Navbar, Nav, NavDropdown, Form, Button } from "react-bootstrap";
import ExcluirUsuarioModal from "../ExcluirConta";
import { useHistory } from "react-router";
import styled from "styled-components";

const Container = styled.nav`
  top: 0;
  background-color: #f8f9fa;
  width: 100vw;
  position: absolute;
  box-sizing: border-box;
  box-shadow: 0.25rem 0.1rem 0.1rem 0.1rem rgba(0, 0, 0, 0.1);
`;

const NavBar = () => {
  const history = useHistory();

  const [modalShow, setModalShow] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("@tcc/jwt");
    history.push("/login");
  };

  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">WhatsApp Sender</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          <Form inline>
            <NavDropdown title="Opções" id="basic-nav-dropdown">
              <NavDropdown.Item
                href="/campanha
              "
              >
                Criar campanha
              </NavDropdown.Item>
              <NavDropdown.Item href="/changePassword">
                Mudar de senha
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => setModalShow(true)}
                style={{ color: "red" }}
              >
                Excluir conta
              </NavDropdown.Item>
            </NavDropdown>
            <Button variant="outline-success" onClick={handleLogout}>
              Logout
            </Button>
          </Form>
        </Navbar.Collapse>
        <ExcluirUsuarioModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </Navbar>
    </Container>
  );
};

export default NavBar;
