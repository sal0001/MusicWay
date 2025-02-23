import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar/navbar";
import styled from "styled-components";
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

const Register = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (nome.trim() === "" || email.trim() === "" || password.trim() === "") {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:3001/home/registar", {
        nome,
        email,
        password,
      });
      console.log("Response:", response.data);

      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Erro no registro. Tente novamente.");
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Container>
      <Navbar />
      <FormContainer>
        <WelcomeMessage>Crie a sua conta</WelcomeMessage>
        <Description>
          Junte-se à nossa comunidade e comece a explorar músicas incríveis.
        </Description>
        <StyledForm onSubmit={handleRegister}>
          <FormGroup>
            <InputContainer>
              <FaUser style={{ marginRight: "10px", color: "#bbb" }} />
              <StyledInput
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </InputContainer>
          </FormGroup>
          <FormGroup>
            <InputContainer>
              <FaEnvelope style={{ marginRight: "10px", color: "#bbb" }} />
              <StyledInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputContainer>
          </FormGroup>
          <FormGroup>
            <InputContainer>
              <FaLock style={{ marginRight: "10px", color: "#bbb" }} />
              <StyledInput
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputContainer>
          </FormGroup>
          <SubmitButton type="submit">
            Registrar <FaArrowRight style={{ marginLeft: "10px" }} />
          </SubmitButton>
          <RedirectText onClick={handleLoginRedirect}>
            Já tem uma conta? <span>Faça login</span>
          </RedirectText>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </StyledForm>
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background: linear-gradient(to bottom, #1e1e2f, #252545);
`;

const FormContainer = styled.div`
  background-color: #2c2c54;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const WelcomeMessage = styled.h2`
  color: #ffffff;
  font-size: 24px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: #bbb;
  font-size: 14px;
  margin-bottom: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #3d3d3d;
  padding: 10px;
  border-radius: 8px;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 1em;
  border: none;
  background-color: transparent;
  color: white;
  outline: none;
  &::placeholder {
    color: #bbb;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  font-size: 1.1em;
  background: linear-gradient(45deg, #ff6b6b, #c05656);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: darkred;
  }
`;

const RedirectText = styled.p`
  text-align: center;
  font-size: 0.9em;
  color: #bbb;
  cursor: pointer;
  margin-top: 15px;
  span {
    color: #ff6b6b;
    font-weight: bold;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.9em;
  text-align: center;
  margin-top: 10px;
`;

export default Register;
