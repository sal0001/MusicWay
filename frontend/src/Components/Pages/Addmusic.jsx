import React, { useState } from "react";
import styled from "styled-components";
import { FaMusic, FaTimes } from "react-icons/fa";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: linear-gradient(to bottom, #2a2a4a, #1e1e2e);
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Title = styled.h2`
  font-size: 1.5em;
  color: white;
  margin-bottom: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: white;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #bbb;
  }
`;

const UploadButton = styled.label`
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  transition: background 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
  }
`;

const Icon = styled(FaMusic)`
  margin-right: 8px;
`;

const FileName = styled.span`
  color: #bbb;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #333;
  color: white;
  font-size: 16px;
  outline: none;

  option {
    background-color: #333;
    color: white;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  color: white;
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  transition: background 0.3s;
  margin-left: auto;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
  }
`;

const MessageText = styled.p`
  color: ${({ error }) => (error ? "#ff4444" : "#4caf50")};
  font-size: 14px;
  text-align: center;
`;

const PublishMusicForm = ({
  showPublishPopup,
  setShowPublishPopup,
  nomeMusica,
  setNomeMusica,
  artista,
  setArtista,
  file,
  setFile,
  categoriaId,
  setCategoriaId,
  errorMessage,
  setErrorMessage,
  isSubmitting,
  setIsSubmitting,
  successMessage,
  setSuccessMessage,
  handlePublishSubmit,
  imagem,
  setImagem,
  categories,
}) => {
  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={() => setShowPublishPopup(false)}>
          <FaTimes />
        </CloseButton>
        <FormWrapper>
          <Title>Submeter Música</Title>
          <form onSubmit={handlePublishSubmit}>
            <InputGroup>
              <Input
                type="text"
                placeholder="Nome da música"
                value={nomeMusica}
                onChange={(e) => setNomeMusica(e.target.value)}
                required
              />
            </InputGroup>
            <br />
            <InputGroup>
              <UploadButton htmlFor="file-upload">
                <Icon />
                Coloque uma música
              </UploadButton>
              <Input
                id="file-upload"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
                style={{ display: "none" }}
              />
              {file && <FileName>{file.name}</FileName>}
            </InputGroup>
            <br />
            <InputGroup>
              <UploadButton htmlFor="image-upload">
                <Icon />
                Coloque uma imagem
              </UploadButton>
              <Input
                id="image-upload"
                type="file"
                onChange={(e) => setImagem(e.target.files[0])}
                required
                style={{ display: "none" }}
              />
              {imagem && <FileName>{imagem.name}</FileName>}
            </InputGroup>
            <br />
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
            <br />
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submetendo..." : "Submeter"}
            </SubmitButton>
            {errorMessage && (
              <MessageText error={Boolean(errorMessage)}>
                {errorMessage}
              </MessageText>
            )}
            {successMessage && <MessageText>{successMessage}</MessageText>}
          </form>
        </FormWrapper>
      </PopupContent>
    </PopupOverlay>
  );
};

export default PublishMusicForm;
