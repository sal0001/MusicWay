import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Logo/MusicWayLogo.png';
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  align-items: center;
  position: fixed;
  padding: 15px 0;
  top: 0;
  width: 100%;
  background-color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 50px;
`;

const Logo = styled.img`
  width: 150px;
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;



const NavMenuRight = styled.div`
  display: flex;
  align-items: center;
`;

const NavButton = styled.button`
  font-weight: bold;
  background-color: transparent;
  border: 0px;
  color: #ffffff;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #444;
  }

  &:last-child {
    margin-right: 0;
  }
`;



const Navbar3 = () => {
  const navigate = useNavigate();


  const clickIMAGE = () => {
    navigate('/');
  };



  return (
    <Header>
      <LogoContainer onClick={clickIMAGE}>
        <Logo src={logo} alt="MusicWay Logo" />
      </LogoContainer>

      <NavbarContainer>
        <NavMenuRight>
              <NavButton onClick={() => navigate('/')}>Home</NavButton>
              <NavButton onClick={() => navigate('/musicas')}>Musicas</NavButton>
              <NavButton onClick={() => navigate('/addCategoria')}>Categorias</NavButton>
              <NavButton onClick={() => navigate('/admin')}>Utilizadores</NavButton>
         
        </NavMenuRight>
      </NavbarContainer>
    </Header>
  );
};

export default Navbar3;

