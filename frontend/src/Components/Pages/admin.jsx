import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar3 from "../navbar/navbar3";
import styled from "styled-components";
import axios from "axios";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e1e2f, #252545);
  width: 100vw;
  overflow-x: hidden;
  color: white;
`;

const ContentContainer = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  align-items: center;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: #3d3d3d;
  color: #ffffff;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background-color: #4a4a4a;
    box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.2);
  }
`;

const UserList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
`;

const UserItem = styled.div`
  background: linear-gradient(to bottom, #3a3a5a, #2c2c54);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  }
`;

const RemoveButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #c05656);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #ff4d4d, #a83a3a);
  }
`;

const Main = () => {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3001/utilizadores");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar os utilizadores:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleRemoveUser = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:3001/utilizadores/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Erro ao remover o utilizador:", error);
    }
  };

  return (
    <div>
      <Navbar3 />
      <PageContainer>
        <ContentContainer>
          <SearchBar
            type="email"
            placeholder="Digite o email do utilizador"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <UserList>
            {users.map((user) => (
              <UserItem key={user._id}>
                <div>
                  <h5>{user.nome}</h5>
                  <p>Email: {user.email}</p>
                </div>
                <RemoveButton onClick={() => handleRemoveUser(user._id)}>
                  <i className="fas fa-trash-alt"></i>
                </RemoveButton>
              </UserItem>
            ))}
          </UserList>
        </ContentContainer>
      </PageContainer>
    </div>
  );
};

export default Main;
