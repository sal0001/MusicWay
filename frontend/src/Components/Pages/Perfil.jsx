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
      alert("Erro ao fazer logout. Tente novamente.");
    }
  };

  const handleEditProfile = () => {
    navigate("/editar-perfil");
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
              <img
                src={
                  user?.avatar ||
                  "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp"
                }
                alt="Avatar"
              />
              <h3>{user?.nome || "Guest"}</h3>
              <p>{user?.email || "No email available"}</p>
              <ButtonContainer>
                <EditButton onClick={handleEditProfile}>Editar</EditButton>
                <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
              </ButtonContainer>
            </LeftColumn>
          </ProfileWrapper>
        )}
      </Container>

      <RightSidebarContainer>
        <br />
        <SidebarLink href="/main/Perfil">
          <FaUserCircle style={{ marginRight: "8px" }} /> Perfil
        </SidebarLink>
        <SidebarLink href="/Sobrenos">
          <FaInfoCircle style={{ marginRight: "8px" }} /> Contactar
        </SidebarLink>
      </RightSidebarContainer>
    </div>
  );
};

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
  background: #2c2c54;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const LeftColumn = styled.div`
  text-align: center;
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #fff;
    margin-bottom: 15px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
`;

const LogoutButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #c05656);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
  &:hover {
    background: darkred;
  }
`;

const EditButton = styled(LogoutButton)`
  background: linear-gradient(45deg, #4caf50, #2e7d32);
  &:hover {
    background: #1b5e20;
  }
`;

const RightSidebarContainer = styled.div`
  width: 170px;
  height: 100vh;
  background: linear-gradient(to bottom, #1e1e2e, #3a3a5a);
  color: white;
  padding: 20px;
  position: fixed;
  top: 70px;
  right: 0;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
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

export default Perfil;
