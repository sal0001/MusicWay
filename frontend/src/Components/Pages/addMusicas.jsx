import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUpload, FaMusic, FaAddressCard, FaInfoCircle, FaUserCircle } from 'react-icons/fa';
import Navbar2 from '../navbar/navbar2';
import axios from 'axios';

const RightSidebarContainer = styled.div`
  width: 90px;
  height: 100vh;
  background-color: #1c1c1c;
  color: white;
  padding: 20px;
  position: fixed;
  top: 70px;
  right: 0;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: all 0.3s ease;
`;

const SidebarTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 30px;
  color: #fff;
  font-weight: bold;
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 20px;
  background-color: transparent;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s, padding-left 0.3s;

  &:hover {
    background-color: #444;
    padding-left: 20px;
  }

  i {
    margin-right: 15px;
    font-size: 1.2em;
  }
`;

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const userObject = JSON.parse(loggedInUser);
      setArtista(userObject.nome);
    }

    const token = localStorage.getItem('token');
    setIsLoggedIn(Boolean(token));

    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const acceptedFormats = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'];
      if (acceptedFormats.includes(selectedFile.type)) {
        setFile(selectedFile);
        setErrorMessage('');
      } else {
        setErrorMessage('Por favor, selecione um arquivo de áudio válido (MP3, WAV, OGG).');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nomeMusica || !artista || !file || !categoriaId) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('nome', nomeMusica);
    formData.append('artista', artista);
    formData.append('categoriaId', categoriaId);
    formData.append('file', file);

    try {
      await axios.post('http://127.0.0.1:3001/addMusicas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setErrorMessage('Música publicada com sucesso.');
      setNomeMusica('');
      setFile(null);
      setCategoriaId('');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Erro ao publicar música');
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
            {errorMessage && <MessageText error={Boolean(errorMessage)}>{errorMessage}</MessageText>}
          </form>
        </FormWrapper>
      </PageContainer>
      {isLoggedIn && (
        <RightSidebarContainer>
          <SidebarTitle></SidebarTitle>
          <SidebarLink href="/main/Perfil"> 
                            <FaUserCircle />
                        </SidebarLink>
          <SidebarLink href="/adicionarMusicas">
            <FaMusic />
          </SidebarLink>
          <SidebarLink href="">
            <FaAddressCard />
          </SidebarLink>
          <SidebarLink href="">
            <FaInfoCircle />
          </SidebarLink>
        </RightSidebarContainer>
      )}
    </div>
  );
};

export default FormComponent;
