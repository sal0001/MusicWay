import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../navbar/navbar2";
import { FaUserCircle, FaInfoCircle } from "react-icons/fa";

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null); // Estado para a mensagem

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
      setMessage("Erro ao fazer logout. Tente novamente."); // Substituir alert por setMessage
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
      setMessage("Perfil atualizado com sucesso!"); // Substituir alert por setMessage
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMessage(error.response?.data?.error || "Erro ao atualizar perfil."); // Substituir alert por setMessage
    }
  };

  return (
    <div>
      <Navbar2 />
      <Container>
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
                  "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp"
                }
                alt="Avatar"
              />
              <UserName>{user?.nome || "Guest"}</UserName>
              <UserEmail>{user?.email || "No email available"}</UserEmail>
              <ButtonContainer>
                <EditButton onClick={handleEditProfile}>Editar</EditButton>
                <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
              </ButtonContainer>
            </LeftColumn>
          </ProfileWrapper>
        )}
        {message && <Message>{message}</Message>}{" "}
      </Container>

      {isLoggedIn ? (
        <RightSidebarContainer>
          <br />
          <SidebarLink href="/main/Perfil">
            <FaUserCircle style={{ marginRight: "8px", fontSize: "30px" }} />
          </SidebarLink>
          <SidebarLink href="/Sobrenos">
            <FaInfoCircle style={{ marginRight: "8px", fontSize: "30px" }} />
          </SidebarLink>
        </RightSidebarContainer>
      ) : (
        <RightSidebarContainer></RightSidebarContainer>
      )}

      {isEditing && (
        <PopupOverlay>
          <PopupContent>
            <label>Nome:</label>
            <input
              type="text"
              value={user?.nome || ""}
              onChange={(e) => setUser({ ...user, nome: e.target.value })}
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

const RightSidebarContainer = styled.div`
  width: 110px;
  height: 100vh;
  background: linear-gradient(to bottom, #1e1e2e, #3a3a5a);
  color: white;
  padding: 20px;
  position: fixed;
  top: 70px;
  right: 0;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
  }
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  background: transparent;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s, padding-left 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff7eb3, #ff758c);
    padding-left: 20px;
  }
`;
const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
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
