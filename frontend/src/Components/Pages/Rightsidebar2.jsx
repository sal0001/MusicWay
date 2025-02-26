// RightSidebar.js
import React from "react";
import styled from "styled-components";
import { FaUserCircle, FaInfoCircle } from "react-icons/fa";

const RightSidebar = ({ isLoggedIn }) => {
  return (
    <RightSidebarContainer>
      <br />
      <SidebarLink href="/Sobrenos">
        <FaInfoCircle style={{ marginRight: "8px", fontSize: "30px" }} />
      </SidebarLink>
    </RightSidebarContainer>
  );
};

const RightSidebarContainer = styled.div`
  width: 110px;
  height: 100vh;
  background: linear-gradient(to bottom, #1e1e2e, #3a3a5a);
  color: white;
  padding: 20px;
  position: fixed;
  top: 70px;
  right: 0;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
  }
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  background: transparent;
  color: white;
  text-decoration: none;
  border-radius: 15px;
  transition: background-color 0.3s, padding-left 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
    padding-left: 20px;
  }
`;

export default RightSidebar;
