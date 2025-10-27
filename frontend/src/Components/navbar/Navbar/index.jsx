import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Logo/MusicWayLogo.png";
import { Header, Container, Logo, NavMenu, NavButton, MobileToggle } from "./styles";

const Navbar1 = () => {
  const navigate = useNavigate();

  const clickIMG = () => {
    navigate("/");
  };

  return (
    <Header>
      <Container>
        <a onClick={clickIMG}>
          <Logo src={logo} alt="MusicWave Logo" />
        </a>

        <MobileToggle className="bi bi-list" />
      </Container>
    </Header>
  );
};

export default Navbar1;

