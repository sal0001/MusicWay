import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Navbar2 from "../navbar/navbar2";
import { useNavigate } from "react-router-dom";

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Main container with enhanced background
const BigContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  background-size: 400% 400%;
  animation: ${keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `} 15s ease infinite;
  color: #fff;
  padding: 80px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 30%,
        rgba(41, 128, 185, 0.15) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba(192, 57, 43, 0.1) 0%,
        transparent 40%
      );
    pointer-events: none;
  }
`;

const PageTitle = styled.h1`
  font-size: 3.2rem;
  margin-top: 30px;
  font-weight: 800;
  margin-bottom: 40px;
  background: linear-gradient(90deg, #ff6f61, #ff9a8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(255, 111, 97, 0.3);
  animation: ${fadeIn} 0.8s ease-out;
`;

// Enhanced container with glass morphism
const Container = styled.div`
  max-width: 1200px;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: 40px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 50px;
  animation: ${fadeIn} 0.6s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    transform: translateY(-5px);
  }
`;

const LeftSide = styled.div`
  flex: 1;
  min-width: 300px;
  text-align: left;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 1024px) {
    text-align: center;
    max-width: 100%;
  }
`;

const Heading = styled.h2`
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #ff6f61;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #ff6f61, transparent);
    border-radius: 2px;

    @media (max-width: 1024px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const SubHeading = styled.div`
  font-size: 1.25rem;
  line-height: 1.8;
  color: #e1e5ee;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Enhanced contact item with hover effects
const ContactItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ContactIcon = styled.span`
  margin-right: 15px;
  font-size: 1.8rem;
  color: #ff6f61;
  animation: ${float} 3s ease-in-out infinite;
`;

const ContactText = styled.span`
  font-weight: 500;
`;

const RightSide = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Enhanced image with more engaging hover effects
const ContactImage = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  transition: all 0.5s ease;

  &:hover {
    transform: scale(1.03) rotate(1deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 111, 97, 0.2),
      rgba(26, 26, 46, 0.6)
    );
    z-index: 1;
    opacity: 0.7;
    transition: opacity 0.5s ease;
  }

  &:hover::before {
    opacity: 0.4;
  }
`;

const RandomImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

// Form container with enhanced styling
const FormContainer = styled.div`
  max-width: 600px;
  width: 100%;
  padding: 30px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.8s ease-out;
`;

const FormTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: #e1e5ee;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Enhanced form inputs with smoother animations
const Input = styled.input`
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:focus {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.3);
    border-color: rgba(255, 111, 97, 0.5);
  }

  &::placeholder {
    color: rgba(211, 216, 232, 0.7);
  }
`;

const TextArea = styled.textarea`
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.07);
  color: #fff;
  font-size: 1rem;
  outline: none;
  resize: vertical;
  min-height: 150px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:focus {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(255, 111, 97, 0.3);
    border-color: rgba(255, 111, 97, 0.5);
  }

  &::placeholder {
    color: rgba(211, 216, 232, 0.7);
  }
`;

// Enhanced button with animations
const SubmitButton = styled.button`
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6f61, #ff4a3d);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(255, 111, 97, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(255, 111, 97, 0.5);
  }

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.7s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const StatusMessage = styled.div`
  padding: 15px;
  border-radius: 12px;
  background: rgba(46, 204, 113, 0.2);
  color: #e1e5ee;
  margin-top: 20px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out, ${pulse} 2s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const SuccessIcon = styled.span`
  font-size: 1.5rem;
`;

// Social media section
const SocialSection = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const SocialIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 111, 97, 0.7);
    box-shadow: 0 5px 15px rgba(255, 111, 97, 0.4);
  }
`;

const Aboutus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(Boolean(token));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
    // Logic to send the message to support
  };

  return (
    <div>
      <Navbar2 />
      <BigContainer>
        <PageTitle>Entre em Contacto</PageTitle>

        <Container>
          <LeftSide>
            <Heading>Estamos aqui para ajudar</Heading>
            <SubHeading>
              <ContactItem>
                <ContactIcon>📧</ContactIcon>
                <ContactText>Email: support@musicway.com</ContactText>
              </ContactItem>
              <ContactItem>
                <ContactIcon>📞</ContactIcon>
                <ContactText>Telefone: +961 123 456 789</ContactText>
              </ContactItem>
              <ContactItem>
                <ContactIcon>📍</ContactIcon>
                <ContactText>
                  Morada: Rua da Alegria, nº 69, 4200-123 Porto
                </ContactText>
              </ContactItem>
            </SubHeading>

            <SocialSection>
              <SocialIcon>📱</SocialIcon>
              <SocialIcon>💼</SocialIcon>
              <SocialIcon>📸</SocialIcon>
              <SocialIcon>🎵</SocialIcon>
            </SocialSection>
          </LeftSide>

          <RightSide>
            <ContactImage>
              <RandomImage
                src="https://st5.depositphotos.com/62628780/64388/i/450/depositphotos_643885138-stock-photo-music-headphones-business-man-singing.jpg"
                alt="Contact"
              />
            </ContactImage>
          </RightSide>
        </Container>

        <Container>
          <FormContainer>
            <FormTitle>Envie-nos uma mensagem</FormTitle>
            <Form onSubmit={handleSubmit}>
              <Input type="text" placeholder="O seu nome" required />
              <Input type="email" placeholder="O seu email" required />
              <Input type="text" placeholder="Assunto" required />
              <TextArea placeholder="A sua mensagem..." required />
              <SubmitButton type="submit">Enviar Mensagem</SubmitButton>
            </Form>

            {showSuccess && (
              <StatusMessage>
                <SuccessIcon>✅</SuccessIcon>
                Mensagem enviada com sucesso! Entraremos em contacto brevemente.
              </StatusMessage>
            )}
          </FormContainer>
        </Container>
      </BigContainer>
    </div>
  );
};

export default Aboutus;
