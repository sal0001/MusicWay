import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Logo/MusicWayLogo.png";
import styled from "styled-components";
import { Home, Music, Tag, Users, CheckSquare, Menu, X } from "lucide-react";

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: "768px",
  tablet: "1024px",
};

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  padding: 15px 0;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to right, #1e1e2f, #252545);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const LogoContainer = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 50px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    margin-left: 20px;
  }
`;

const Logo = styled.img`
  width: 150px;
  height: auto;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: 120px;
  }
`;

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 0 50px;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 0 20px;
  }
`;

const NavMenuRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
    width: 250px;
    height: 100vh;
    flex-direction: column;
    background: linear-gradient(to bottom, #1e1e2f, #252545);
    padding: 80px 20px 20px;
    transition: right 0.3s ease-in-out;
    box-shadow: ${({ isOpen }) =>
      isOpen ? "-2px 0 5px rgba(0, 0, 0, 0.3)" : "none"};
    z-index: 999;
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: transparent;
  border: 1px dashed #ffffff;
  color: #ffffff;
  padding: 10px;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(138, 43, 226, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  ${({ active }) =>
    active &&
    `
    border: 1px solid #ffffff;
    box-shadow: 0 0 10px #8a2be2, 0 0 20px rgba(138, 43, 226, 0.5);
    background: rgba(255, 255, 255, 0.15);
  `}

  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: 100%;
    justify-content: flex-start;
    gap: 10px;
    height: 50px;
    padding: 10px 15px;
  }
`;

const TooltipText = styled.span`
  visibility: hidden;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
  font-size: 12px;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  ${NavButton}:hover & {
    visibility: visible;
    opacity: 1;
  }

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: none;
  }
`;

const ButtonText = styled.span`
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: block;
    font-size: 14px;
    margin-left: 8px;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  z-index: 1001;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: flex;
    align-items: center;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  display: none;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 998;
  transition: opacity 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

const Navbar3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleResize = useCallback(() => {
    if (window.innerWidth > parseInt(BREAKPOINTS.mobile)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const navigateAndClose = useCallback(
    (path) => {
      navigate(path);
      setIsOpen(false);
    },
    [navigate]
  );

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const navItems = [
    { path: "/", icon: <Home size={24} />, text: "Home" },
    { path: "/musicas", icon: <Music size={24} />, text: "Músicas" },
    { path: "/addCategoria", icon: <Tag size={24} />, text: "Géneros" },
    { path: "/admin", icon: <Users size={24} />, text: "Utilizadores" },
    {
      path: "/aprovarMusicas",
      icon: <CheckSquare size={24} />,
      text: "Aprovar Músicas",
    },
  ];

  return (
    <>
      <Header>
        <LogoContainer onClick={() => navigateAndClose("/")}>
          <Logo src={logo} alt="MusicWay Logo" />
        </LogoContainer>

        <NavbarContainer>
          <HamburgerButton onClick={toggleMenu} aria-label="Toggle menu">
            <Menu size={28} />
          </HamburgerButton>

          <NavMenuRight isOpen={isOpen}>
            <CloseButton
              isOpen={isOpen}
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <X size={28} />
            </CloseButton>

            {navItems.map((item) => (
              <NavButton
                key={item.path}
                onClick={() => navigateAndClose(item.path)}
                active={isActive(item.path)}
                aria-label={item.text}
              >
                {item.icon}
                <TooltipText>{item.text}</TooltipText>
                <ButtonText>{item.text}</ButtonText>
              </NavButton>
            ))}
          </NavMenuRight>
        </NavbarContainer>
      </Header>
      <Overlay isOpen={isOpen} onClick={closeMenu} />
    </>
  );
};

export default Navbar3;
