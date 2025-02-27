import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar2 from "../navbar/navbar2";
import { useNavigate } from "react-router-dom";
import RightSidebar from "./Rightsidebar";

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

const Aboutus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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
      {isLoggedIn && <RightSidebar />}
    </div>
  );
};

export default Aboutus;
