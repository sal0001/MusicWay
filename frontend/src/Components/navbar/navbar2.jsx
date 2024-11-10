import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import logo from '../Logo/MusicWayLogo.png';
import axios from 'axios';
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  align-items: center;
  position: fixed;
  padding: 15px 0;
  top: 0;
  width: 100%;
  background-color: #333; /* Cor de fundo */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 250px;
`;

const Logo = styled.img`
  width: 150px;
`;

const NavbarContainer = styled.div`
  display: flex;
  justify-content: flex-end; /* Alinha todos os itens à direita */
  align-items: center;
  width: 100%;
  padding: 0 20px;
`;

const NavMenu = styled.nav`
  ul {
    display: flex;
    list-style-type: none;
    margin: 0; 
    padding: 0;
  }

  li {
    margin: 0 20px; /* Ajuste o espaçamento */
    position: relative;
  }

  a {
    text-decoration: none;
    font-size: 1.1em;
    color: white;
    font-weight: bold;
    display: block;
    padding: 5px 10px;
    transition: color 0.3s;
  }

  a:hover {
    color: black;
  }
`;

const LogoutButton = styled.button`
  margin-right: 250px; 
  background-color: red;
  color: white;
  font-weight: bold;
  font-size: 18px;
  border: none;
  padding: 10px 30px; 
  border-radius: 5px;  
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: darkred;
  }
`;

const Navbar2 = () => {
  const navigate = useNavigate();

  const clickIMAGE = () => {
    navigate('/main');
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao fazer logout. Tente novamente.');
    }
  };

  return (
    <Header>
      <LogoContainer onClick={clickIMAGE}>
        <Logo src={logo} alt="MusicWave Logo" />
      </LogoContainer>

      <NavbarContainer>
        <NavMenu>
          <ul>
            <li>
              <a href="/main/Perfil">
                Perfil
              </a>
            </li>
          </ul>
        </NavMenu>

        <LogoutButton onClick={handleLogout}>
          Sair
        </LogoutButton>
      </NavbarContainer>
    </Header>
  );
};

export default Navbar2;
