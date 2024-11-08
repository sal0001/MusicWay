import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Navbar3 from '../navbar/navbar3';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
`;

const FormContainer = styled.div`
  background-color: #2b2b2b; // Cinza escuro
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
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

const AddCategoria = () => {
  const [nome, setNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

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
    </PageContainer>
    </div>
  );
};

export default AddCategoria;
