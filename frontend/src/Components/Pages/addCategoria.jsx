import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar3 from '../navbar/navbar3';
import styled from 'styled-components';
import axios from 'axios';

const PageContainer = styled.div`
  display: flex; /* Changed to flex to align the form and the category list horizontally */
  justify-content: center;
  align-items: flex-start; /* Align to the top */
  padding: 40px;
  margin-top: 150px;
  max-width: 1200px;
  height: 100vh; /* Ensures it takes full viewport height for vertical centering */
`;

const FormContainer = styled.div`
  background-color: #2b2b2b;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  width: 400px; /* Fixed width for the form */
  text-align: center;
  margin-right: 20px; /* Space between the form and the separator */
`;

const Separator = styled.div`
  width: 1px; /* Thickness of the separator line */
  background-color: #ccc; /* Light gray color for the separator */
  margin: 0 30px; /* Space around the separator */
  height: 100%; /* Makes the separator take up full height */
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
  max-width: 700px;
  margin-top: 20px;
`;

const CategoryItem = styled.li`
  background-color: #ffffff;
  margin: 15px 0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }
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
        console.error('Erro ao procurar os generos:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome) {
      setErro('O nome do genero é obrigatório.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:3001/addCategoria', { nome });
      setNome('');
      setMensagem(response.data.message);
      setErro('');
      setCategorias((prevCategorias) => [...prevCategorias, { nome }]);
    } catch (error) {
      setErro('Erro ao adicionar o genero. Tente novamente.');
      setMensagem('');
      console.error('Erro ao criar o genero:', error);
    }
  };

  const handleRemoveCategoria = async (categoriaId) => {
    try {
      await axios.delete(`http://127.0.0.1:3001/removeCategoria/${categoriaId}`);
      setCategorias(categorias.filter((categoria) => categoria._id !== categoriaId));
    } catch (error) {
      console.error('Erro ao remover a categoria:', error);
    }
  };

  return (
    <div>
      <Navbar3 />
      <PageContainer>
        <FormContainer>
          <form onSubmit={handleSubmit}>
            <StyledInput
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do genero"
              required
            />
            <StyledButton type="submit">Adicionar Genero</StyledButton>
          </form>
          {mensagem && <MessageText>{mensagem}</MessageText>}
          {erro && <MessageText error>{erro}</MessageText>}
        </FormContainer>
        
        <Separator />
        
        <CategoryList>
          {categorias.map((categoria) => (
            <CategoryItem key={categoria._id}>
              <div>
                <h5>{categoria.nome}</h5>
              </div>
              <RemoveButton onClick={() => handleRemoveCategoria(categoria._id)}>
                <i className="fas fa-trash-alt"></i>
              </RemoveButton>
            </CategoryItem>
          ))}
        </CategoryList>
      </PageContainer>
    </div>
  );
};

export default AddCategoria;
