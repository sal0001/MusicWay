import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Navbar2 from '../navbar/navbar2';

const ProfileContainer = styled.div`
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 2rem 0;
`;

const ContentContainer = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 2rem 1rem;
  background: grey;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  color: grey; // cor dourada
`;

const ProfileInfo = styled.p`
  font-size: 1.5rem;
  margin: 0.5rem 0;
  font-family: 'Roboto', sans-serif;
  color: grey; // cor clara
`;

const ErrorMessage = styled.p`
  color: grey; 
  font-size: 1.2rem;
  text-align: center;
`;

const LoadingMessage = styled.p`
  color: white; // cor dourada para o carregamento
  font-size: 1.5rem;
  text-align: center;
`;

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          setError('Você não está logado.');
          return;
        }

        const response = await axios.get('/main/perfil', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setUser(response.data); 
      } catch (err) {
        console.error('Fetch user data error:', err); 
        setError(err.response ? err.response.data.error : 'Erro ao buscar utilizador.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"></link>
      <Navbar2 />
      <ProfileContainer>
        <ContentContainer>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {user ? ( 
            <>
              <ProfileTitle>Perfil do Utilizador</ProfileTitle>
              <ProfileInfo><strong>Nome:</strong> {user.nome || 'N/A'}</ProfileInfo>
              <ProfileInfo><strong>Email:</strong> {user.email || 'N/A'}</ProfileInfo>
            </>
          ) : (
            <LoadingMessage>A carregar...</LoadingMessage>
          )}
        </ContentContainer>
      </ProfileContainer>
    </div>
  );
};

export default Perfil;
