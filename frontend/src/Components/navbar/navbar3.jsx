import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Home, Music, Tag, Users, CheckSquare, Menu, X } from "lucide-react";
import logo from "../Logo/MusicWayLogo.png";

const Header = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  background: linear-gradient(135deg, #1e1e2f 0%, #252545 50%, #1e1e2f 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;

  &:hover {
    background: linear-gradient(135deg, #252545 0%, #1e1e2f 50%, #252545 100%);
  }
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
  cursor: pointer;
`;

const NavMenu = styled.nav`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
    width: 200px;
    height: 100vh;
    flex-direction: column;
    background: rgba(30, 30, 47, 0.9);
    padding: 60px 20px;
    transition: right 0.3s ease;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #8a2be2;
  }

  ${({ active }) => active && "color: #8a2be2;"}

  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { path: "/", icon: <Home size={20} />, text: "Home" },
    { path: "/musicas", icon: <Music size={20} />, text: "Músicas" },
    { path: "/addCategoria", icon: <Tag size={20} />, text: "Géneros" },
    { path: "/admin", icon: <Users size={20} />, text: "Utilizadores" },
    {
      path: "/aprovarMusicas",
      icon: <CheckSquare size={20} />,
      text: "Aprovar",
    },
  ];

  return (
    <Header>
      <Logo src={logo} alt="MusicWay Logo" onClick={() => navigate("/")} />

      <MenuButton onClick={toggleMenu}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </MenuButton>

      <NavMenu isOpen={isOpen}>
        {navItems.map((item) => (
          <NavButton
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setIsOpen(false);
            }}
            active={location.pathname === item.path}
          >
            {item.icon}
            <span>{item.text}</span>
          </NavButton>
        ))}
      </NavMenu>
    </Header>
  );
};

export default Navbar;
