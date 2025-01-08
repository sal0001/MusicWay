import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar2 from '../navbar/navbar2';
import { FaMusic, FaAddressCard, FaInfoCircle, FaUserCircle } from 'react-icons/fa';

const BigContainer = styled.div`
  min-height: 100vh;  
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  background: linear-gradient(to bottom, #d3d3d3, grey);
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

const Container = styled.div`
  max-width: 1320px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 80px auto;
  padding: 10px 0;

  @media (max-width: 1024px) {
    flex-direction: column-reverse;
  }
`;

const LeftSide = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 300px;

  @media (max-width: 1024px) {
    align-items: center;
    max-width: 480px;
  }

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Heading = styled.p`
  font-size: 40px;
  line-height: 64px;
  font-weight: 900;
  color: Black;
  margin-bottom: 40px;

  @media (max-width: 1024px) {
    text-align: center;
    max-width: 370px;
  }

  @media (max-width: 500px) {
    font-size: 25px;
    line-height: 40px;
    max-width: 370px;
    
  }
`;

const SubHeading = styled.p`
  font-size: 14px;
  line-height: 25px;
  color: black;
  margin-bottom: 40px;
  

  @media (max-width: 1024px) {
    text-align: center;
  }
`;

const RightSide = styled.div`
  width: 675px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 700px;

  @media (max-width: 1024px) {
    margin: 0 auto 70px;
  }

  @media (max-width: 768px) {
    width: 450px;
    height: 450px;
  }

  @media (max-width: 500px) {
    width: 100%;
    height: 250px;
    margin-bottom: 100px;
  }
`;

const RandomImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;


const Aboutus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
          const userObject = JSON.parse(loggedInUser);
          console.log('Logado:', userObject);
        }
    
        const token = localStorage.getItem('token');
        setIsLoggedIn(Boolean(token));
      }, []);
  return (
    <div>
      <Navbar2 />
      <BigContainer>
        <Container>
          <LeftSide>
            <Heading>Contacta-nos</Heading>
            <SubHeading>
            Email: support@semajafrica.com
            <br />
            Phone: +123-456-7890
            <br />
            Address: 1234 Digital Ave, Learning City, EduState
            </SubHeading>
          </LeftSide>
          <RightSide>
            <RandomImage src="https://www.alento.pt/public/uploads/images/06a0012d79ca74489694aebe2a779ef6.jpg" alt="Random" />
          </RightSide>
        </Container>
      </BigContainer>
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

export default Aboutus;
