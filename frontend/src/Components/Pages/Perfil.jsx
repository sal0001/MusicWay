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
                        Authorization: `Bearer ${token}`,
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
            <Container>
                {loading ? (
                    <p>Carregando...</p>
                ) : error ? (
                    <ErrorMessage>{error}</ErrorMessage>
                ) : (
                    <>
                        <ProfileWrapper>
                            <div className="row">
                                <LeftColumn>
                                    <img
                                        src={user?.avatar || 'https://via.placeholder.com/150'}
                                        alt="Avatar"
                                    />
                                    <h3>{user?.nome || 'Guest'}</h3>
                                    <p>{user?.email || 'No email available'}</p>
                                </LeftColumn>
                                <MiddleColumn>
                                    <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
                                </MiddleColumn>
                            </div>
                        </ProfileWrapper>
                    </>
                )}
            </Container>

            {isLoggedIn && (
                <RightSidebarContainer>
                    <SidebarTitle></SidebarTitle>
                    <SidebarLink href="/main/Perfil">
                        <FaUserCircle style={{ marginRight: '8px' }} />
                        Perfil
                    </SidebarLink>
                    <SidebarLink href="/adicionarMusicas">
                        <FaMusic style={{ marginRight: '8px' }} />
                        Publicar
                    </SidebarLink>
                    <SidebarLink href="/criarPlaylist">
                        <FaAddressCard style={{ marginRight: '8px' }} />
                        Playlist
                    </SidebarLink>
                    <SidebarLink href="/Sobrenos">
                        <FaInfoCircle style={{ marginRight: '8px' }} />
                        Contactar
                    </SidebarLink>
                </RightSidebarContainer>
            )}
        </div>
    );
};

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom, #d3d3d3, grey);
    color: white;
`;

const ProfileWrapper = styled.div`
    max-width: 900px;
    background: grey;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    color: white;
    text-align: center;
`;

const LeftColumn = styled.div`
    text-align: center;
    margin-top: 30px;

    img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid #fff;
        margin-bottom: 20px;
    }
`;

const MiddleColumn = styled.div`
    margin-top: 30px;

    span {
        display: block;
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 10px;
    }
`;

const LogoutButton = styled.button`
    margin-top: 20px;
    background: linear-gradient(45deg, #ff6b6b, #c05656);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s;

    &:hover {
        background: darkred;
    }
`;

const RightSidebarContainer = styled.div`
    width: 170px;
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
`;

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
`;

export default Perfil;
