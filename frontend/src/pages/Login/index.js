import React from "react";
import { LoginForm } from "../../components/LoginForm";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const LoginPage = () => (
  <Container>
    <LoginForm />
  </Container>
);

export default LoginPage;
