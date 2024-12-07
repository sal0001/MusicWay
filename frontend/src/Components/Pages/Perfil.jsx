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
                        <ProfileInfo className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <ProfileImage
                                className="rounded-circle mt-5"
                                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                                alt="Profile"
                            />
                            <span className="font-weight-bold">{user?.nome || "Guest"}</span>
                            <span className="text-black-50">{user?.email || "No email available"}</span>
                        </ProfileInfo>
                    </LeftColumn>

                    <MiddleColumn className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <Header className="d-flex justify-content-between align-items-center mb-3">
                                <h4>O seu perfil</h4>
                            </Header>
                            <FormRow className="row mt-3">
                                <div className="col-md-12">
                                    <Label className="labels">Nome</Label>
                                    <Input type="text" className="form-control" placeholder="Nome" />
                                </div>
                                <div className="col-md-12">
                                    <Label className="labels">Email</Label>
                                    <Input type="text" className="form-control" placeholder="Email" />
                                </div>
                            </FormRow>
                            <div className="mt-5 text-center">
                            <SaveButton >Salvar</SaveButton>
                            <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
                            </div>
                        </div>
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
                        <FaUserCircle />
                    </SidebarLink>
                    <SidebarLink href="/adicionarMusicas">
                        <FaMusic />
                    </SidebarLink>
                    <SidebarLink href="/criarPlaylist">
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

const SaveButton = styled.button`
    margin-top: 20px;
    background-color: black;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: grey;
    }
`;


const Container = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ProfileWrapper = styled.div`
    max-width: 1000px;
    border: solid 2px black;
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

const Header = styled.div`
    margin-bottom: 20px;
`;

const FormRow = styled.div`
    margin-top: 20px;
`;

const Label = styled.label`
    font-size: 11px;
    margin-bottom: 5px;
    display: block;
`;

const Input = styled.input`
    &:focus {
        box-shadow: none;
        border-color: #ba68c8;
    }
`;


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
