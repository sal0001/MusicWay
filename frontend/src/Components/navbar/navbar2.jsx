import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Logo/MusicWayLogo.png';
import styled from 'styled-components';
import axios from 'axios';

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

const Navbar2 = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const user = JSON.parse(localStorage.getItem('user'));

      // Verificar se o token ainda é válido
      if (token && user) {
        const isTokenValid = await verifyToken(token);
        if (!isTokenValid && refreshToken) {
          // Tentar obter um novo token com o refresh token
          const newToken = await refreshAccessToken(refreshToken);
          if (newToken) {
            localStorage.setItem('token', newToken);
            setIsLoggedIn(true);
            if (user.email === 'admin@gmail.com') {
              setIsAdmin(true);
            }
          } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
          }
        } else {
          setIsLoggedIn(true);
          if (user.email === 'admin@gmail.com') {
            setIsAdmin(true);
          }
        }
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, []);

  const verifyToken = async (token) => {
    try {
      // Simular a verificação do token
      const response = await axios.post('http://127.0.0.1:3001/verify-token', { token });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:3001/refresh-token',
        { refreshToken }
      );
      if (response.status === 200) {
        return response.data.token;
      }
      return null;
    } catch (error) {
      console.error('Erro ao renovar o token:', error);
      return null;
    }
  };

  const clickIMAGE = () => {
    navigate('/');
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <Header>
      <LogoContainer onClick={clickIMAGE}>
        <Logo src={logo} alt="MusicWay Logo" />
      </LogoContainer>

      <NavbarContainer>
        <NavMenuLeft>
          
        </NavMenuLeft>

        <NavMenuRight>
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <NavButton onClick={handleAdminClick}>Painel admin</NavButton>
              )}
            </>
          ) : (
            <>
              <NavButton onClick={() => navigate('/registar')}>Registar</NavButton>
              <NavButton style={{ border: '1px dotted' }} onClick={() => navigate('/login')}>
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
