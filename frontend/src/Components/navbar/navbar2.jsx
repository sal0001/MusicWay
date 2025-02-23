import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Logo/MusicWayLogo.png";
import styled from "styled-components";

const Header = styled.header`
  display: flex;
  align-items: center;
  position: fixed;
  padding: 15px 0;
  top: 0;
  width: 100%;
  background: linear-gradient(to right, #1e1e2f, #252545);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 50px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Logo = styled.img`
  width: 150px;
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Alinha os itens à direita */
  align-items: center;
  width: 100%;
  padding: 0 50px; /* Adiciona padding para afastar do limite da tela */
`;

const NavMenuRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px; /* Espaçamento entre os botões */
`;

const NavButton = styled.button`
  font-weight: bold;
  background: ${(props) =>
    props.variant === "outline"
      ? "transparent"
      : "linear-gradient(45deg, #ff6b6b, #c05656)"};
  border: ${(props) =>
    props.variant === "outline" ? "1px dashed #ffffff" : "none"};
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.variant === "outline"
        ? "rgba(255, 255, 255, 0.1)"
        : "linear-gradient(45deg, #c05656, #ff6b6b)"};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Navbar2 = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // Verificar se o token existe e se há um usuário logado
      if (token && user) {
        setIsLoggedIn(true);
        if (user.email === "admin@gmail.com") {
          setIsAdmin(true);
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  const clickIMAGE = () => {
    navigate("/");
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  return (
    <Header>
      <LogoContainer onClick={clickIMAGE}>
        <Logo src={logo} alt="MusicWay Logo" />
      </LogoContainer>

      <NavbarContainer>
        <NavMenuRight>
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <NavButton onClick={handleAdminClick}>Painel admin</NavButton>
              )}
            </>
          ) : (
            <>
              <NavButton onClick={() => navigate("/registar")}>
                Registar
              </NavButton>
              <NavButton variant="outline" onClick={() => navigate("/login")}>
                Login
              </NavButton>
            </>
          )}
        </NavMenuRight>
      </NavbarContainer>
    </Header>
  );
};

export default Navbar2;
