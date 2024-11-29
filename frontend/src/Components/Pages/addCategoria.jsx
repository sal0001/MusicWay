import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Navbar3 from '../navbar/navbar3';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background-color: white;
  margin-top: 150px;
`;

const FormContainer = styled.div`
  background-color: #2b2b2b;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 24px;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
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
  margin-top: 20px;
  background-color: #555555;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #777777;
  }
`;

const MessageText = styled.p`
  color: ${(props) => (props.error ? '#ff4d4d' : '#4caf50')};
  margin-top: 20px;
  font-size: 14px;
  font-family: Arial, sans-serif;
`;

const CategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 400px;
`;

const CategoryItem = styled.li`
  background-color: #f0f0f0;
  color: #333;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  font-size: 16px;
`;

const AddCategoria = () => {
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [categorias, setCategorias] = useState([]);


  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/getCategorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Erro ao buscar as categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome) {
      setErro('O nome da categoria é obrigatório.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:3001/addCategoria', { nome });
      setNome('');
      setMensagem(response.data.message);
      setErro('');

      setCategorias((prevCategorias) => [...prevCategorias, { nome }]);
    } catch (error) {
      setErro('Erro ao adicionar a categoria. Tente novamente.');
      setMensagem('');
      console.error('Erro ao enviar a categoria:', error);
    }
  };

  return (
    <div>
      <Navbar3 />
      <PageContainer>
        <FormContainer>
          <Title>Adicionar Categoria</Title>
          <form onSubmit={handleSubmit}>
            <StyledInput
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da Categoria"
              required
            />
            <StyledButton type="submit">Adicionar Categoria</StyledButton>
          </form>
          {mensagem && <MessageText>{mensagem}</MessageText>}
          {erro && <MessageText error>{erro}</MessageText>}
        </FormContainer>
        <CategoryList>
          {categorias.map((categoria, index) => (
            <CategoryItem key={index}>{categoria.nome}</CategoryItem>
          ))}
        </CategoryList>
      </PageContainer>
    </div>
  );
};

export default AddCategoria;
