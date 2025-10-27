import styled from "styled-components";

export const Header = styled.header`
  display: flex;
  align-items: center;
  position: fixed;
  padding: 15px 0;
  top: 0;
  width: 100%;
  background: linear-gradient(to right, #1e1e2f, #252545);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Logo = styled.img`
  width: 150px;
  cursor: pointer;
`;

export const NavMenu = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavButton = styled.button`
  font-weight: bold;
  border: 1px dashed #f0f0f0;
  background-color: transparent;
  color: #ffffff;
  padding: 8px 16px;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #444;
  }

  &:last-child {
    margin-right: 0;
  }
`;

export const MobileToggle = styled.i`
  display: none;
  font-size: 24px;
  color: #ffffff;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

