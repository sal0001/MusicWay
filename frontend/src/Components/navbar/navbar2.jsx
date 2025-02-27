import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Logo/MusicWayLogo.png";
import styled, { keyframes } from "styled-components";
import {
  FaUser,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserPlus,
  FaShieldAlt,
  FaMusic,
} from "react-icons/fa";

// Keyframes for animations
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.7); }
  100% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.3); }
`;

// Styled Components
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px 0;
  background: linear-gradient(135deg, #1e1e2f 0%, #252545 50%, #1e1e2f 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #252545 0%, #1e1e2f 50%, #252545 100%);
  }
`;

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  margin-left: 25px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1) rotate(2deg);
  }

  @media (max-width: 768px) {
    margin-left: 15px;
  }
`;

const Logo = styled.img`
  width: 150px;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(255, 107, 107, 0.2));

  @media (max-width: 768px) {
    width: 120px;
  }
`;

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 0 25px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const NavMenuRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 20px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 280px;
    background: linear-gradient(to bottom, #252545, #1e1e2f);
    padding: 80px 20px 20px;
    animation: ${slideIn} 0.3s ease-out;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.4);
    z-index: 999;
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  background: ${({ variant }) =>
    variant === "outline"
      ? "transparent"
      : "linear-gradient(45deg, #ff6b6b, #ff8e8e)"};
  border: ${({ variant }) =>
    variant === "outline" ? "2px solid #ff6b6b" : "none"};
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transition: all 0.4s ease;
  }

  &:hover:before {
    left: 0;
  }

  &:hover {
    transform: translateY(-3px) scale(1.03);
    animation: ${glow} 1.5s infinite;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 25px;
    border-radius: 8px;
    justify-content: flex-start;
  }
`;

const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 28px;
  cursor: pointer;
  padding: 5px 15px;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 998;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const NavIcon = styled.span`
  display: inline-flex;
  align-items: center;
  transition: transform 0.3s ease;

  ${NavButton}:hover & {
    transform: scale(1.2);
  }
`;

const Navbar2 = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setIsLoggedIn(!!token && !!user);
    setIsAdmin(user?.email === "admin@gmail.com");
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    });
    return () => window.removeEventListener("resize", () => {});
  }, [checkAuth]);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      setIsMobileMenuOpen(false);
    },
    [navigate]
  );

  const navItems = {
    loggedIn: [
      { path: "/main/Perfil", icon: <FaUser />, text: "Perfil" },
      { path: "/Sobrenos", icon: <FaInfoCircle />, text: "Sobre Nós" },
      ...(isAdmin
        ? [{ path: "/admin", icon: <FaShieldAlt />, text: "Painel Admin" }]
        : []),
    ],
    loggedOut: [
      { path: "/registar", icon: <FaUserPlus />, text: "Registar" },
      {
        path: "/login",
        icon: <FaSignInAlt />,
        text: "Login",
        variant: "outline",
      },
    ],
  };

  return (
    <>
      <Header>
        <LogoContainer onClick={() => handleNavigate("/")}>
          <Logo src={logo} alt="MusicWay Logo" />
        </LogoContainer>

        <NavbarContainer>
          <Hamburger
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </Hamburger>

          <NavMenuRight isOpen={isMobileMenuOpen}>
            {(isLoggedIn ? navItems.loggedIn : navItems.loggedOut).map(
              (item) => (
                <NavButton
                  key={item.path}
                  variant={item.variant}
                  onClick={() => handleNavigate(item.path)}
                  aria-label={item.text}
                >
                  <NavIcon>{item.icon}</NavIcon>
                  {item.text}
                </NavButton>
              )
            )}
          </NavMenuRight>
        </NavbarContainer>
      </Header>
      <Overlay
        isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default Navbar2;
