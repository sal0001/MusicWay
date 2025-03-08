import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Logo/MusicWayLogo.png";
import styled from "styled-components";
import { Home, Music, Tag, Users, CheckSquare, Menu, X } from "lucide-react";

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
  background: rgba(30, 30, 47, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

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
  gap: 20px;

  @media (max-width: ${BREAKPOINTS.mobile}) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
    width: 280px;
    height: 100vh;
    flex-direction: column;
    background: rgba(30, 30, 47, 0.95);
    backdrop-filter: blur(10px);
    padding: 80px 20px 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${({ isOpen }) =>
      isOpen ? "-5px 0 15px rgba(0, 0, 0, 0.3)" : "none"};
    z-index: 999;
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 12px;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(138, 43, 226, 0.2),
      rgba(138, 43, 226, 0.1)
    );
    border: 1px solid rgba(138, 43, 226, 0.5);
    box-shadow: 0 5px 15px rgba(138, 43, 226, 0.3);
  }

  ${({ active }) =>
    active &&
    `
    background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(138, 43, 226, 0.15));
    border: 1px solid #8a2be2;
    box-shadow: 0 0 15px rgba(138, 43, 226, 0.4);
  `}

  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
    height: 55px;
    padding: 12px 20px;
    border-radius: 8px;
  }
`;

const TooltipText = styled.span`
  visibility: hidden;
  background: rgba(51, 51, 51, 0.95);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 6px 12px;
  position: absolute;
  z-index: 1;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s;
  white-space: nowrap;
  font-size: 13px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: rgba(51, 51, 51, 0.95) transparent transparent transparent;
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
    font-size: 15px;
    margin-left: 10px;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

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
  padding: 8px;
  display: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(90deg);
  }

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
  background: rgba(0, 0, 0, 0.6);
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
