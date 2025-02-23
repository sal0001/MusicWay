import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from "../Logo/MusicWayLogo.png";

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
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center; /* Centraliza o conteúdo horizontalmente */
`;

const Logo = styled.img`
  width: 150px;
  cursor: pointer;
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavButton = styled.button`
  font-weight: bold;
  border: 1px dashed #f0f0f0;
  background-color: transparent;
  color: #ffffff;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #444;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const MobileToggle = styled.i`
  display: none;
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar1 = () => {
  const navigate = useNavigate();

  const clickIMG = () => {
    navigate("/");
  };

  return (
    <Header>
      <Container>
        <a onClick={clickIMG}>
          <Logo src={logo} alt="MusicWave Logo" />
        </a>

        <MobileToggle className="bi bi-list" />
      </Container>
    </Header>
  );
};

export default Navbar1;
