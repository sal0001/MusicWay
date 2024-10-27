import React, { useState } from 'react';
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
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile && selectedFile.type === 'audio/wav') {
      setFile(selectedFile);
      setErrorMessage(''); 
    } else {
      setFile(null);
      setErrorMessage('Por favor, selecione um arquivo wav.'); 
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setErrorMessage('Por favor, selecione um arquivo MP3 antes de publicar.'); 
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('nome', nomeMusica);
    formData.append('artista', artista);
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:3001/addMusicas', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      setErrorMessage('Música publicada com sucesso.');
    } catch (error) {
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
