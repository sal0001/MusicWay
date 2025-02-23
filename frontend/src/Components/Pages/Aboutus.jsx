import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar2 from "../navbar/navbar2";
import { FaMusic, FaInfoCircle, FaUserCircle } from "react-icons/fa";

const BigContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #1e1e2f, #252545);
  color: white;
  padding: 40px 20px;
  text-align: center;
`;

const Container = styled.div`
  max-width: 1100px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 50px;
  padding: 20px;
`;

const LeftSide = styled.div`
  max-width: 450px;
  text-align: left;

  @media (max-width: 1024px) {
    text-align: center;
  }
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ffcc00;
`;

const SubHeading = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #ddd;
`;

const RightSide = styled.div`
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RandomImage = styled.img`
  max-width: 100%;
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
`;

const RightSidebarContainer = styled.div`
  width: 170px;
  height: 100vh;
  background: linear-gradient(to bottom, #1e1e2e, #3a3a5a);
  color: white;
  padding: 20px;
  position: fixed;
  top: 70px;
  right: 0;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
  }
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  background: transparent;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s, padding-left 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff7eb3, #ff758c);
    padding-left: 20px;
  }
`;

const Aboutus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
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
              📧 Email: support@musicway.com
              <br />
              📞 Telefone: +961 123 456 789
              <br />
              📍 Morada: Rua da Alegria, nº 69, 4200-123 Porto
            </SubHeading>
          </LeftSide>
          <RightSide>
            <RandomImage
              src="https://st5.depositphotos.com/62628780/64388/i/450/depositphotos_643885138-stock-photo-music-headphones-business-man-singing.jpg"
              alt="Contact"
            />
          </RightSide>
        </Container>
      </BigContainer>
      {isLoggedIn && (
        <RightSidebarContainer>
          <br />
          <SidebarLink href="/main/Perfil">
            <FaUserCircle style={{ marginRight: "8px" }} /> Perfil
          </SidebarLink>
          <SidebarLink href="/Sobrenos">
            <FaInfoCircle style={{ marginRight: "8px" }} /> Contactar
          </SidebarLink>
        </RightSidebarContainer>
      )}
    </div>
  );
};

export default Aboutus;
