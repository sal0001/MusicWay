import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../Logo/MusicWayLogo.png';

const Header = styled.header`
  background-color: #333;
  padding: 20px 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  font-family: 'Roboto Mono', monospace;
  margin-bottom: 20px; // Aumente este valor para ajustar a margem inferior
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
    navigate('/');
  };

  return (
    <Header>
      <Container>
        <a onClick={clickIMG}>
          <Logo src={logo} alt="MusicWave Logo" />
        </a>
        <NavMenu>
          <NavButton onClick={() => window.location.href = '/home/login'}>Entrar</NavButton>
          <NavButton onClick={() => window.location.href = '/home/registar'}>Criar</NavButton>
        </NavMenu>
        <MobileToggle className="bi bi-list" />
      </Container>
    </Header>
  );
};

export default Navbar1;
