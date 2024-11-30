import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const NavMenuLeft = styled.nav`
  ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0 20px;
  }

  a {
    text-decoration: none;
    color: white;
    font-size: 1.1em;
    font-weight: bold;
  }
`;

const NavMenuRight = styled.div`
  display: flex;
  align-items: center;
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

  &:hover {
    background-color: #444;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const LogoutButton = styled(NavButton)`
  background-color: red;
  border: 1px solid red;

  &:hover {
    background-color: darkred;
  }
`;

const PublishButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  background-color: transparent;
  color: black;
  font-size: 1em;
  font-weight: bold;
  border-radius: 25px; /* Bordas arredondadas */
  text-decoration: none;
  border: 2px solid black; /* Borda preta para destacar */
  width: auto; /* Largura automática para ajustar ao conteúdo */
  height: 45px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1); /* Leve sombreamento no hover */
  }
`;

const Navbar2 = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const clickIMAGE = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsLoggedIn(false);

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
        <NavMenuLeft>
          <ul>
            {isLoggedIn && (
              <li>
                <PublishButton href="/adicionarMusicas">
                  Publicar Música
                </PublishButton>
              </li>
            )}
          </ul>
        </NavMenuLeft>

        <NavMenuRight>
          {isLoggedIn ? (
            <>
              <NavButton onClick={() => navigate('/main/Perfil')}>Perfil</NavButton>
              <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
            </>
          ) : (
            <>
              <NavButton onClick={() => navigate('/login')}>Login</NavButton>
              <NavButton onClick={() => navigate('/registar')}>Registar</NavButton>
            </>
          )}
        </NavMenuRight>
      </NavbarContainer>
    </Header>
  );
};

export default Navbar2;
