import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Music, Tag, Users, CheckSquare, Menu, X } from "lucide-react";
import logo from "../../Logo/MusicWayLogo.png";
import { Header, Logo, NavMenu, NavButton, MenuButton } from "./styles";

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

