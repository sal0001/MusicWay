import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUpload } from 'react-icons/fa'; 
import Navbar3 from '../navbar/navbar3';
import axios from 'axios';

const Container = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 2em;
  background-color: #fff;
  width: 100%;
  margin: 0 auto;
`;

const FormWrapper = styled.div`
  border: 2px solid grey;
  border-radius: 8px;
  padding: 2em;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Row = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column; 
  margin-bottom: 1em;
`;

const InputGroup = styled.div`
  margin-top: 10px;
  margin-bottom: 2px;
  position: relative;
  width: 100%; 
`;

const Input = styled.input`
  width: 100%;
  padding: 1em;
  line-height: 1.4;
  background-color: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  transition: 0.35s ease-in-out;

  &:focus {
    outline: 0;
    border-color: #bd8200;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1em;
  background-color: #f9f9f9;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  transition: 0.35s ease-in-out;

  &:focus {
    outline: 0;
    border-color: #bd8200;
  }
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed grey;
  border-radius: 8px;
  padding: 1em;
  cursor: pointer;
  color: grey;
  transition: background-color 0.2s;
  width: 100%; 
  
  &:hover {
    background-color: rgba(189, 130, 0, 0.1);
  }
`;

const Icon = styled(FaUpload)`
  margin-right: 0.5em; 
`;

const Button = styled.button`
  padding: 1em 2em;
  background-color: grey;
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
  font-size: 1em;
  margin-top: 1em;

  &:hover {
    background-color: black;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
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
      <Navbar3 />
      <Container>
        <FormWrapper>
          <form onSubmit={handleSubmit}>
            <Row>
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
            </Row>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Publicando...' : 'Publicar'}
            </Button>
            {errorMessage && <p className="error">{errorMessage}</p>}
          </form>
        </FormWrapper>
      </Container>
    </div>
  );
};

export default FormComponent;
