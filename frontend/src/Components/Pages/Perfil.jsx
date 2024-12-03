import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../navbar/navbar2';
import { FaMusic, FaAddressCard, FaInfoCircle, FaUserCircle } from 'react-icons/fa';

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); 

        if (!token) {
            setError('Utilizador não encontrado. Por favor, faça login.');
            setLoading(false);
            return;
        }

        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const userObject = JSON.parse(loggedInUser);
            setUser(userObject);
        }

        setIsLoggedIn(Boolean(token));

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth', {  
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data.authenticated) {
                    setUser(response.data.user); 
                } else {
                    setError('Falha na autenticação.');
                }
            } catch (err) {
                console.error('Erro:', err);
                setError('Erro ao carregar os dados do usuário. Por favor, faça login.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout. Tente novamente.');
        }
    };

    return (
        <div>
            <Navbar2 />
            <MainContainer>
                <ProfileCard>
                    {loading ? (
                        <p>Carregando...</p>
                    ) : error ? (
                        <ErrorMessage>{error}</ErrorMessage>
                    ) : (
                        <>
                            <UserDetails>
                                <h1>Detalhes do utilizador</h1>
                                <DetailItem>
                                    {user?.nome || 'Não disponível'} 
                                </DetailItem>
                                <DetailItem>
                                    {user?.email || 'Não disponível'}
                                </DetailItem>
                            </UserDetails>

                            <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
                        </>
                    )}
                </ProfileCard>
            </MainContainer>

            {isLoggedIn && (
                <RightSidebarContainer>
                    <SidebarTitle></SidebarTitle>
                    <SidebarLink href="/main/Perfil"> 
                        <FaUserCircle />
                    </SidebarLink>
                    <SidebarLink href="/adicionarMusicas">
                        <FaMusic />
                    </SidebarLink>
                    <SidebarLink href="">
                        <FaAddressCard />
                    </SidebarLink>
                    <SidebarLink href="">
                        <FaInfoCircle />
                    </SidebarLink>
                </RightSidebarContainer>
            )}
        </div>
    );
};

const RightSidebarContainer = styled.div`
  width: 90px;
  height: 100vh;
  background-color: #1c1c1c;
  color: white;
  padding: 20px;
  position: fixed;
  top: 70px;
  right: 0;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: all 0.3s ease;
`;

const SidebarTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 30px;
  color: #fff;
  font-weight: bold;
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 20px;
  background-color: transparent;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s, padding-left 0.3s;

  &:hover {
    background-color: #444;
    padding-left: 20px;
  }

  i {
    margin-right: 15px;
    font-size: 1.2em;
  }
`;

const MainContainer = styled.div`
    padding: 50px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f2f5;
    height: 100vh;
`;

const ProfileCard = styled.div`
    width: 100%;
    max-width: 500px;
    background-color: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
`;

const UserDetails = styled.div`
    text-align: left;
    margin-bottom: 30px;
`;

const DetailItem = styled.p`
    font-size: 1.1rem;
    color: #555;
    margin: 8px 0;
    strong {
        font-weight: bold;
        color: #333;
    }
`;

const LogoutButton = styled.button`
    margin-top: 20px;
    background-color: red;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: darkred;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
`;

export default Perfil;
