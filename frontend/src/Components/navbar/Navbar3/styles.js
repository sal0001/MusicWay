import styled from "styled-components";

export const Header = styled.header`
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

export const Logo = styled.img`
  width: 120px;
  height: auto;
  cursor: pointer;
`;

export const NavMenu = styled.nav`
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

export const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: pink;
  }

  ${({ active }) => active && "color: rgb(216, 191, 216);"}

  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

export const MenuButton = styled.button`
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

