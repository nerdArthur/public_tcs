import React from "react";
import { ForgotPasswordForm } from "../../components/ForgotPasswordForm";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const ForgotPasswordPage = () => (
  <Container>
    <ForgotPasswordForm />
  </Container>
);

export default ForgotPasswordPage;
