import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar/navbar";
import styled from "styled-components";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Resetando a mensagem de erro

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Email e Password são obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:3001/home/login",
        { email: trimmedEmail, password: trimmedPassword },
        { withCredentials: true } // Enviando cookies de autenticação
      );

      if (response.status === 200) {
        const { token, user } = response.data;

        // Armazenando os dados no localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirecionando conforme o tipo de usuário
        if (user.email === "admin@gmail.com") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);

      if (error.response) {
        const errorMessage =
          error.response.data.error ||
          "Email ou Password incorretos. Tente novamente.";
        setErrorMessage(errorMessage);
      } else if (error.request) {
        setErrorMessage("Erro de rede. Tente novamente mais tarde.");
      } else {
        setErrorMessage(
          "Ocorreu um erro ao processar a solicitação. Tente novamente."
        );
      }
    } finally {
      setLoading(false); // Finaliza o estado de loading
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/registar");
  };

  return (
    <Container>
      <Navbar />
      <FormContainer>
        <WelcomeMessage>Bem-vindo de volta</WelcomeMessage>
        <Description>Faça login e explore músicas incríveis.</Description>
        <StyledForm onSubmit={handleLogin}>
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
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "A entrar..." : "Entrar"}{" "}
            <FaArrowRight style={{ marginLeft: "10px" }} />
          </SubmitButton>
          <RegisterText onClick={handleRegisterRedirect}>
            Ainda não se registou? <span>Registre-se aqui</span>
          </RegisterText>
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
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const RegisterText = styled.p`
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

export default Login;
