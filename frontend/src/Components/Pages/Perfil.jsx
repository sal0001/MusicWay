import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Navbar2 from '../navbar/navbar2';

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage

        if (!token) {
            setError('Token not found. Please log in again.');
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth', {  // Ensure correct URL
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data.authenticated) {
                    setUser(response.data.user); // Set user data to state
                } else {
                    setError('Authentication failed. Invalid token.');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to fetch user data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <Navbar2 />
            <MainContainer>
                <ProfileCard>
                    {loading ? (
                        <p>Loading...</p>  
                    ) : error ? (
                        <ErrorMessage>{error}</ErrorMessage>  
                    ) : (
                        <>
                            <ProfileHeader>
                                <ProfileImage>
                                    <img src="https://via.placeholder.com/120" alt="User Avatar" />
                                </ProfileImage>
                            </ProfileHeader>

                            <UserDetails>
                                <DetailItem>
                                    <strong>Nome:</strong> {user?.nome || 'Não disponível'} 
                                </DetailItem>
                                <DetailItem>
                                    <strong>Email:</strong> {user?.email || 'Não disponível'} 
                                </DetailItem>
                            </UserDetails>

                            <ActionButtons>
                                <EditButton>Editar Perfil</EditButton>
                            </ActionButtons>
                        </>
                    )}
                </ProfileCard>
            </MainContainer>
        </div>
    );
};


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

const ProfileHeader = styled.div`
    margin-bottom: 20px;
`;

const ProfileImage = styled.div`
    margin: 0 auto 20px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
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

const ActionButtons = styled.div`
    display: flex;
    justify-content: space-around;
`;

const EditButton = styled.button`
    background-color: black;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;

    &:hover {
        background-color: #ccc;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
`;

export default Perfil;
