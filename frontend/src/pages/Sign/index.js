import React from "react";
import { SignForm } from "../../components/SignForm";
import styled from "styled-components";

const Container = styled.div`
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const SignPage = () => (
  <Container>
    <SignForm />
  </Container>
);

export default SignPage;
