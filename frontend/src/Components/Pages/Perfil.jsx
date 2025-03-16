import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components"; // Add 'css' import
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../navbar/navbar2";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Utilizador não encontrado. Por favor, faça login.");
      setLoading(false);
      return;
    }

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
    setIsLoggedIn(Boolean(token));

    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/auth", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.authenticated) {
          setUser(response.data.user);
        } else {
          setError("Falha na autenticação.");
        }
      } catch (err) {
        setError(
          "Erro ao carregar os dados do usuário. Por favor, faça login."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      setMessage("Erro ao fazer logout. Tente novamente.");
    }
  };

  const handleEditProfile = () => setIsEditing(true);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedData = { nome: user.nome };
      const response = await axios.put(
        "http://localhost:3001/auth/editar-perfil",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setMessage("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      setMessage(error.response?.data?.error || "Erro ao atualizar perfil.");
    }
  };

  return (
    <div>
      <Navbar2 />
      <Container>
        {loading ? (
          <LoadingSpinner>Carregando...</LoadingSpinner>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <ProfileCard>
            <AvatarWrapper>
              <Avatar
                src={
                  user?.avatar ||
                  "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Image-Background.png"
                }
                alt="Avatar"
              />
            </AvatarWrapper>
            <UserName>{user?.nome || "Guest"}</UserName>
            <UserEmail>{user?.email || "No email available"}</UserEmail>
            <AboutSection>
              <h4>Sobre Mim</h4>
              <p>{user?.bio || "Nenhuma informação adicional fornecida."}</p>
            </AboutSection>
            <ButtonContainer>
              <ActionButton primary onClick={handleEditProfile}>
                Editar
              </ActionButton>
              <ActionButton onClick={handleLogout}>Sair</ActionButton>
            </ButtonContainer>
          </ProfileCard>
        )}
        {message && (
          <Message type={message.includes("Erro") ? "error" : "success"}>
            {message}
          </Message>
        )}
      </Container>

      {isEditing && (
        <PopupOverlay>
          <PopupContent>
            <PopupTitle>Editar Perfil</PopupTitle>
            <label>Nome:</label>
            <StyledInput
              type="text"
              value={user?.nome || ""}
              onChange={(e) => setUser({ ...user, nome: e.target.value })}
            />
            <ButtonContainer>
              <ActionButton primary onClick={handleSaveProfile}>
                Salvar
              </ActionButton>
              <ActionButton onClick={() => setIsEditing(false)}>
                Cancelar
              </ActionButton>
            </ButtonContainer>
          </PopupContent>
        </PopupOverlay>
      )}
    </div>
  );
};

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 111, 97, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 111, 97, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 111, 97, 0); }
`;

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #fff;
  padding: 60px 20px;
  overflow: hidden;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 111, 97, 0.1),
      transparent 70%
    );
    z-index: 0;
  }
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  animation: ${fadeIn} 0.6s ease-out;
  backdrop-filter: blur(12px);
  text-align: center;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 25px;
`;

const Avatar = styled.img`
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 5px solid #ff6f61;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  &:hover {
    transform: scale(1.08) rotate(2deg);
    box-shadow: 0 0 20px rgba(255, 111, 97, 0.5);
  }
`;

const UserName = styled.h3`
  font-size: 32px;
  font-weight: 700;
  margin: 15px 0;
  color: #ff6f61;
  letter-spacing: 0.5px;
  text-transform: capitalize;
`;

const UserEmail = styled.p`
  font-size: 16px;
  color: #c0c8e6;
  margin-bottom: 25px;
  font-style: italic;
`;

const AboutSection = styled.div`
  margin: 25px 0;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  h4 {
    font-size: 20px;
    color: #fff;
    margin-bottom: 12px;
    font-weight: 600;
  }
  p {
    font-size: 15px;
    color: #d8e0f0;
    line-height: 1.6;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 25px;
`;

const ActionButton = styled.button`
  background: ${(props) => (props.primary ? "#ff6f61" : "#3e4265")};
  color: #fff;
  padding: 14px 30px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${(props) => (props.primary ? "#ff8779" : "#50557e")};
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: translateY(1px);
  }

  ${(props) =>
    props.primary &&
    css`
      animation: ${pulse} 2s infinite;
    `}
`;

const Message = styled.div`
  padding: 15px 25px;
  margin: 20px 0;
  background: ${(props) => (props.type === "error" ? "#ff5555" : "#4cd987")};
  color: #fff;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  animation: ${fadeIn} 0.4s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled.p`
  color: #ff5555;
  font-size: 18px;
  text-align: center;
  background: rgba(255, 85, 85, 0.15);
  padding: 20px;
  border-radius: 12px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const LoadingSpinner = styled.p`
  font-size: 20px;
  color: #ff6f61;
  font-weight: 500;
  display: flex;
  align-items: center;
  &:before {
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #ff6f61;
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    margin-right: 12px;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  color: #1e1e3a;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.4s ease;
`;

const PopupTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #ff6f61;
  margin-bottom: 10px;
`;

const StyledInput = styled.input`
  padding: 12px;
  border: 2px solid #e0e6f0;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    border-color: #ff6f61;
    box-shadow: 0 0 8px rgba(255, 111, 97, 0.3);
  }
`;

export default Perfil;
