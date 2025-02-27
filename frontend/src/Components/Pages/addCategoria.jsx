import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar3 from "../navbar/navbar3";
import styled, { keyframes } from "styled-components"; // Added keyframes for animations
import axios from "axios";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(78, 115, 223, 0.7); }
  70% { box-shadow: 0 0 0 12px rgba(78, 115, 223, 0); }
  100% { box-shadow: 0 0 0 0 rgba(78, 115, 223, 0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #2a2a4e);
  color: #ffffff;
  font-family: "Inter", sans-serif;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(78, 115, 223, 0.1),
      transparent 70%
    );
    z-index: 0;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1300px;
  margin-top: 90px;
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  z-index: 1;
`;

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.06);
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 420px;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.5s ease-out;
`;

const CategoryContainer = styled.div`
  background: rgba(255, 255, 255, 0.06);
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 740px;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h4`
  margin-bottom: 2rem;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  font-size: 1.75rem;
  position: relative;
  letter-spacing: 0.5px;

  &:after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #4e73df, transparent);
    border-radius: 2px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 1.05rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.45);
    font-style: italic;
  }

  &:focus {
    border-color: #4e73df;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 15px rgba(78, 115, 223, 0.4);
    outline: none;
  }
`;

const InputIcon = styled.i`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
  transition: all 0.3s ease;
  ${StyledInput}:focus + & {
    color: #4e73df;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #4e73df 0%, #355eca 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  &:hover {
    background: linear-gradient(135deg, #5a85e8 0%, #4068d3 100%);
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(78, 115, 223, 0.4);
    &:before {
      width: 400px;
      height: 400px;
    }
  }

  &:active {
    transform: translateY(1px);
  }
`;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-top: 2rem;
`;

const CategoryItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.25rem;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  span {
    font-size: 1.05rem;
    color: #e0e6f0;
  }
`;

const RemoveButton = styled.button`
  background: #ff4757;
  border: none;
  padding: 0.6rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff6b78;
    transform: scale(1.1);
  }

  i {
    color: white;
    font-size: 1rem;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2.5rem;
`;

const PageButton = styled.button`
  padding: 10px 20px;
  background: ${(props) =>
    props.active ? "#4e73df" : "rgba(255, 255, 255, 0.06)"};
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.active ? "#5a85e8" : "rgba(255, 255, 255, 0.1)"};
    transform: translateY(-2px);
  }
`;

const AddCategoria = () => {
  const [nome, setNome] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:3001/getCategorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao obter categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome) return;

    try {
      await axios.post("http://127.0.0.1:3001/addCategoria", { nome });
      setNome("");
      fetchCategorias();
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  };

  const handleRemoveCategoria = async (categoriaId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:3001/removeCategoria/${categoriaId}`
      );
      fetchCategorias();
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
    }
  };

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategorias.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <PageContainer>
      <Navbar3 />
      <ContentContainer>
        <FormContainer>
          <Title>Adicionar Categoria</Title>
          <form onSubmit={handleSubmit}>
            <InputWrapper>
              <StyledInput
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Introduza o nome da categoria"
                required
              />
              <InputIcon className="fas fa-folder-plus" />
            </InputWrapper>
            <StyledButton type="submit">Adicionar Categoria</StyledButton>
          </form>
        </FormContainer>
        <CategoryContainer>
          <Title>Categorias</Title>
          <InputWrapper>
            <StyledInput
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Pesquisar categorias..."
            />
            <InputIcon className="fas fa-search" />
          </InputWrapper>
          <CategoryList>
            {currentItems.map((categoria) => (
              <CategoryItem key={categoria._id}>
                <span>{categoria.nome}</span>
                <RemoveButton
                  onClick={() => handleRemoveCategoria(categoria._id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </RemoveButton>
              </CategoryItem>
            ))}
          </CategoryList>
          {totalPages > 1 && (
            <PaginationContainer>
              {Array.from({ length: totalPages }, (_, i) => (
                <PageButton
                  key={i + 1}
                  active={currentPage === i + 1}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </PageButton>
              ))}
            </PaginationContainer>
          )}
        </CategoryContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default AddCategoria;
