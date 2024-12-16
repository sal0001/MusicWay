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
            <Container>
            {loading ? (
                <p>Carregando...</p>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : (
                <>
                <ProfileWrapper className="container rounded bg-white mt-5 mb-5">
                    <div className="row">
                    
                        <LeftColumn className="col-md-3 border-right">
                            <ProfileInfo className="d-flex flex-column align-items-center text-center p-3 py-4">
                                <ProfileImage
                                    className="rounded-circle mt-5"
                                    src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                                    alt="Profile"
                                />
                            </ProfileInfo>
                        </LeftColumn>
                        <Separator className="col-md-1 d-flex justify-content-center">
                            <Divider />
                        </Separator>

    
                        <MiddleColumn className="col-md-2">
                            <div className="p-2 py-5">
                                <FormRow className="row mt-3">
                                    <div className="col-md-15">
                                        <Label className="labels">Nome</Label>
                                        <span className="font-weight-bold">{user?.nome || "Guest"}</span>
                                    </div>
                                    <div className="col-md-15">
                                        <Label className="labels">Email</Label>
                                        <span className="font-weight-bold">{user?.email || "No email available"}</span>
                                    </div>
                                </FormRow>
                                <div className="mt-5 text-center">
                                    <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
                                </div>
                            </div>
                        </MiddleColumn>
                    </div>
                </ProfileWrapper>
                </>
            )}
            </Container>   

             {isLoggedIn ? (
                <RightSidebarContainer>
                    <SidebarTitle></SidebarTitle>
                    <SidebarLink  href="/main/Perfil"> 
                        <FaUserCircle  style={{ marginRight: '8px' }}/>Perfil
                    </SidebarLink>
                    <SidebarLink href="/adicionarMusicas">
                        <FaMusic style={{ marginRight: '8px' }} />Publicar
                    </SidebarLink>
                    <SidebarLink href="/criarPlaylist">
                        <FaAddressCard style={{ marginRight: '8px' }} />Playlist
                    </SidebarLink>
                    <SidebarLink href="/Sobrenos">
                        <FaInfoCircle style={{ marginRight: '8px' }} />Contactar     
                    </SidebarLink>
                </RightSidebarContainer>
            ) : (
                <RightSidebarContainer>
                   <SidebarTitle></SidebarTitle>
                </RightSidebarContainer>
            )}
            
        </div>
    );
};

const Separator = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    
`;

const Divider = styled.div`
    height: 80%;
    width: 2px;
    background-color: #ddd;
    
`;

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    
`;

const ProfileWrapper = styled.div`
    max-width: 800px;
    background-color: grey;
    
`;

const LeftColumn = styled.div`
    text-align: center;
`;

const ProfileInfo = styled.div`
    padding-top: 40px;
    
`;

const ProfileImage = styled.img`
    width: 150px;
`;

const MiddleColumn = styled.div``;

const FormRow = styled.div`
    margin-top: 20px;
`;

const Label = styled.label`
    font-size: 11px;
    margin-bottom: 5px;
    display: block;
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
