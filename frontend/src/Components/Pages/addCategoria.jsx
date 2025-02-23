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
  flex-direction: row;
  gap: 40px;
  width: 100%;
  max-width: 1000px;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const FormContainer = styled.div`
  background-color: #2c2c54;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  width: 350px;
  text-align: center;
  flex-shrink: 0;
`;

const CategoryContainer = styled.div`
  background-color: #2c2c54;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 600px;
  text-align: center;
  flex-shrink: 0;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
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

const StyledButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: linear-gradient(45deg, #ff6b6b, #c05656);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #ff4d4d, #a83a3a);
  }
`;

const CategoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const CategoryItem = styled.div`
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

const AddCategoria = () => {
  const [nome, setNome] = useState("");
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3001/getCategorias");
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome) return;

    try {
      const response = await axios.post("http://127.0.0.1:3001/addCategoria", {
        nome,
      });
      setCategorias([...categorias, response.data]);
      setNome("");
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    }
  };

  const handleRemoveCategoria = async (categoriaId) => {
    try {
      await axios.delete(
        `http://127.0.0.1:3001/removeCategoria/${categoriaId}`
      );
      setCategorias(
        categorias.filter((categoria) => categoria._id !== categoriaId)
      );
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
    }
  };

  return (
    <div>
      <Navbar3 />
      <PageContainer>
        <ContentContainer>
          <FormContainer>
            <h4>Adicionar Categoria</h4>
            <form onSubmit={handleSubmit}>
              <StyledInput
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da categoria"
                required
              />
              <StyledButton type="submit">Adicionar</StyledButton>
            </form>
          </FormContainer>
          <CategoryContainer>
            <h4>Categorias</h4>
            <CategoryList>
              {categorias.map((categoria) => (
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
          </CategoryContainer>
        </ContentContainer>
      </PageContainer>
    </div>
  );
};

export default AddCategoria;
