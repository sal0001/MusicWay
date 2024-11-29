import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUpload } from 'react-icons/fa'; 
import Navbar2 from '../navbar/navbar2';
import axios from 'axios';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
`;

const FormWrapper = styled.div`
  background-color: #2b2b2b;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 24px;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
`;

const InputGroup = styled.div`
  margin: 10px 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
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

const Select = styled.select`
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

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background-color: #3d3d3d;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 8px;

  &:hover {
    background-color: #4a4a4a;
  }
`;

const Icon = styled(FaUpload)`
  margin-right: 0.5em; 
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #555555;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #777777;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const MessageText = styled.p`
  color: ${(props) => (props.error ? '#ff4d4d' : '#4caf50')};
  margin-top: 20px;
  font-size: 14px;
  font-family: Arial, sans-serif;
`;

const FormComponent = () => {
  const [nomeMusica, setNomeMusica] = useState('');
  const [artista, setArtista] = useState('');
  const [file, setFile] = useState(null);
  const [categoriaId, setCategoriaId] = useState('');
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3001/getCategorias');
        setCategories(response.data);  
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Erro ao carregar categorias');
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile && selectedFile.type === 'audio/wav') {
      setFile(selectedFile);
      setErrorMessage(''); 
    } else {
      setFile(null);
      setErrorMessage('Por favor, selecione um arquivo WAV.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!nomeMusica || !artista || !file || !categoriaId) {
      setErrorMessage('Por favor, preencha todos os campos: nome da música, artista, arquivo e categoria.');
      return;
    }
  
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append('nome', nomeMusica);
    formData.append('artista', artista);
    formData.append('categoriaId', categoriaId);
    formData.append('file', file); 
  
    try {
      const response = await axios.post('http://127.0.0.1:3001/addMusicas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Música publicada com sucesso:', response.data);
      setErrorMessage('Música publicada com sucesso.');
  
      setNomeMusica('');
      setArtista('');
      setFile(null);
      setCategoriaId('');
    } catch (error) {
      console.error('Erro ao publicar música:', error);
      const errorResponse = error.response?.data?.error || 'Erro ao publicar a música';
      setErrorMessage(errorResponse);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar2 />
      <PageContainer>
        <FormWrapper>
          <Title>Publicar Música</Title>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <Input
                type="text"
                placeholder="Nome da música"
                value={nomeMusica}
                onChange={(e) => setNomeMusica(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <Input
                type="text"
                placeholder="Nome do artista"
                value={artista}
                onChange={(e) => setArtista(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup>
              <UploadButton htmlFor="file-upload">
                <Icon />
                Selecione um arquivo
              </UploadButton>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                required
                style={{ display: 'none' }} 
              />
            </InputGroup>
            <InputGroup>
              <Select 
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nome}
                  </option>
                ))}
              </Select>
            </InputGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </SubmitButton>
            {errorMessage && <MessageText error>{errorMessage}</MessageText>}
          </form>
        </FormWrapper>
      </PageContainer>
    </div>
  );
};

export default FormComponent;
