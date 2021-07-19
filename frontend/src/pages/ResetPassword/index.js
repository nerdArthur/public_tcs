import React from "react";
import styled from "styled-components";
import { ResetPasswordForm } from "../../components/ResetPasswordForm";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const ResetPasswordPage = () => (
  <Container>
    <ResetPasswordForm />
  </Container>
);

export default ResetPasswordPage;
