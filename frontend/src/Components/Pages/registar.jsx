import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar/navbar";
import styled, { keyframes } from "styled-components";
import { FaUser, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
  70% { box-shadow: 0 0 0 12px rgba(255, 107, 107, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 107, 107, 0.1),
      transparent 70%
    );
    z-index: 0;
  }
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.06);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  animation: ${fadeIn} 0.6s ease-out;
  z-index: 1;
`;

const WelcomeMessage = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
`;

const Description = styled.p`
  color: #d0d8e8;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #ff6b6b;
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.3);
  }
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 6px 0;
  font-size: 1.05rem;
  border: none;
  background: transparent;
  color: #ffffff;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
  }
`;

const SubmitButton = styled.button`
  padding: 14px;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #ff6b6b 0%, #c05656 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${pulse} 2s infinite;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #ff8787 0%, #d46e6e 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    &:before {
      width: 400px;
      height: 400px;
    }
  }

  &:active {
    transform: translateY(1px);
  }
`;

const RedirectText = styled.p`
  text-align: center;
  font-size: 0.95rem;
  color: #d0d8e8;
  margin-top: 1.5rem;
  cursor: pointer;

  span {
    color: #ff6b6b;
    font-weight: 600;
    transition: all 0.3s ease;
    &:hover {
      text-decoration: underline;
      color: #ff8787;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.95rem;
  text-align: center;
  margin-top: 1rem;
  background: rgba(255, 77, 77, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

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
          Junta-te à nossa comunidade e começa a explorar músicas incríveis.
        </Description>
        <StyledForm onSubmit={handleRegister}>
          <FormGroup>
            <InputContainer>
              <FaUser style={{ marginRight: "12px", color: "#d0d8e8" }} />
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
              <FaEnvelope style={{ marginRight: "12px", color: "#d0d8e8" }} />
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
              <FaLock style={{ marginRight: "12px", color: "#d0d8e8" }} />
              <StyledInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputContainer>
          </FormGroup>
          <SubmitButton type="submit">
            Registrar <FaArrowRight style={{ marginLeft: "12px" }} />
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

export default Register;
