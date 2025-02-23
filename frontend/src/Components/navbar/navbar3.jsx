import React from "react";
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
  background: linear-gradient(
    to right,
    #1e1e2f,
    #252545
  ); /* Gradiente moderno */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Sombra mais suave */
  z-index: 1000;
`;

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 50px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05); /* Efeito de escala ao passar o mouse */
  }
`;

const Logo = styled.img`
  width: 150px;
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Alinha os botões à direita */
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
  background: transparent;
  border: 1px dashed #ffffff; /* Borda tracejada */
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1); /* Efeito de hover suave */
    border: 1px solid #ffffff; /* Borda sólida ao passar o mouse */
    transform: translateY(-2px); /* Efeito de elevação */
  }

  &:active {
    transform: translateY(0); /* Remove a elevação ao clicar */
  }
`;

const Navbar3 = () => {
  const navigate = useNavigate();

  const clickIMAGE = () => {
    navigate("/");
  };

  return (
    <Header>
      <LogoContainer onClick={clickIMAGE}>
        <Logo src={logo} alt="MusicWay Logo" />
      </LogoContainer>

      <NavbarContainer>
        <NavMenuRight>
          <NavButton onClick={() => navigate("/")}>Home</NavButton>
          <NavButton onClick={() => navigate("/musicas")}>Músicas</NavButton>
          <NavButton onClick={() => navigate("/addCategoria")}>
            Gêneros
          </NavButton>
          <NavButton onClick={() => navigate("/admin")}>Utilizadores</NavButton>
          <NavButton onClick={() => navigate("/aprovarMusicas")}>
            Aprovar-Músicas
          </NavButton>
        </NavMenuRight>
      </NavbarContainer>
    </Header>
  );
};

export default Navbar3;
