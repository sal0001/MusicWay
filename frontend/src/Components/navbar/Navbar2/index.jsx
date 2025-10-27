import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Logo/MusicWayLogo.png";
import {
  FaUser,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaUserPlus,
  FaShieldAlt,
} from "react-icons/fa";
import {
  Header,
  LogoContainer,
  Logo,
  NavbarContainer,
  NavMenuRight,
  NavButton,
  Hamburger,
  Overlay,
  NavIcon,
} from "./styles";

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
      { path: "/Sobrenos", icon: <FaInfoCircle />, text: "Sobre N+�s" },
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
