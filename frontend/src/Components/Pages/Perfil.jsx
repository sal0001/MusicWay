// Perfil.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../navbar/navbar2";
import RightSidebar from "./Rightsidebar"; // Importe o componente RightSidebar

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
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
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

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const updatedData = {
        nome: user.nome,
      };

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
      console.error("Erro ao atualizar perfil:", error);
      setMessage(error.response?.data?.error || "Erro ao atualizar perfil.");
    }
  };

  return (
    <div>
      <Navbar2 />
      <Container>
        <Title>Bem vindo ao teu Perfil</Title>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
          <ProfileWrapper>
            <LeftColumn>
              <Avatar
                src={
                  user?.avatar ||
                  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="Avatar"
              />
              <UserName>{user?.nome || "Guest"}</UserName>
              <UserEmail>{user?.email || "No email available"}</UserEmail>
              <AboutSection>
                <h4>Sobre Mim</h4>
                <p>{user?.bio || "Nenhuma informação adicional fornecida."}</p>
              </AboutSection>
              <ButtonContainer>
                <EditButton onClick={handleEditProfile}>Editar</EditButton>
                <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
              </ButtonContainer>
            </LeftColumn>
          </ProfileWrapper>
        )}
        {message && <Message>{message}</Message>}
      </Container>

      {isLoggedIn && <RightSidebar />}

      {isEditing && (
        <PopupOverlay>
          <PopupContent>
            <label>Nome:</label>
            <input
              type="text"
              value={user?.nome || ""}
              onChange={(e) => setUser({ ...user, nome: e.target.value })}
            />

            <label>Bio:</label>
            <textarea
              value={user?.bio || ""}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
            />

            <ButtonContainer>
              <SaveButton onClick={() => handleSaveProfile(user)}>
                Salvar
              </SaveButton>
              <CancelButton onClick={() => setIsEditing(false)}>
                Cancelar
              </CancelButton>
            </ButtonContainer>
          </PopupContent>
        </PopupOverlay>
      )}
    </div>
  );
};

// Estilos adicionais para o componente de mensagem
const Message = styled.div`
  padding: 10px;
  margin: 10px 0;
  background-color: ${({ type }) => (type === "error" ? "#ff4444" : "#4CAF50")};
  color: white;
  border-radius: 5px;
  text-align: center;
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #1e1e2f, #252545);
  color: white;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
  color: #ff3d6e;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const LeftColumn = styled.div`
  text-align: center;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid white;
  margin-bottom: 20px;
`;

const UserName = styled.h3`
  margin: 10px 0;
  font-size: 24px;
`;

const UserEmail = styled.p`
  margin: 5px 0;
  font-size: 16px;
  color: #ccc;
`;

const AboutSection = styled.div`
  margin: 20px 0;
  text-align: left;
  max-width: 400px;

  h4 {
    font-size: 18px;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    color: #ccc;
  }
`;

const EditButton = styled.button`
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #a71d2a;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ErrorMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.9em;
  text-align: center;
  margin-top: 10px;
`;

const SaveButton = styled.button`
  background: #ff3d6e;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #ff568c;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #5a6268;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopupContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: black;
`;

export default Perfil;
