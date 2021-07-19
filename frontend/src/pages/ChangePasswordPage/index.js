import React from "react";
import NavBar from "../../components/NavBar";
import styled from "styled-components";
import { ChangePasswordForm } from "../../components/ChangePasswordForm";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const ChangePasswordPage = () => (
  <Container>
    <NavBar />
    <ChangePasswordForm />
  </Container>
);

export default ChangePasswordPage;
