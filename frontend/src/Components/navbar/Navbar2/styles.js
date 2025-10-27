import styled, { keyframes } from "styled-components";

// Keyframes for animations
export const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.7); }
  100% { box-shadow: 0 0 5px rgba(255, 107, 107, 0.3); }
`;

// Styled Components
export const Header = styled.header`
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

export const LogoContainer = styled.a`
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

export const Logo = styled.img`
  width: 55px;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(255, 107, 107, 0.2));

  @media (max-width: 768px) {
    width: 120px;
  }
`;

export const NavbarContainer = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 0 25px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

export const NavMenuRight = styled.div`
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

export const NavButton = styled.button`
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

export const Hamburger = styled.button`
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

export const Overlay = styled.div`
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

export const NavIcon = styled.span`
  display: inline-flex;
  align-items: center;
  transition: transform 0.3s ease;

  ${NavButton}:hover & {
    transform: scale(1.2);
  }
`;
