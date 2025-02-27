import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FaMusic, FaImage, FaTimes } from "react-icons/fa";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const PopupContent = styled.div`
  background: linear-gradient(to bottom, #2a2a4a, #1e1e2e);
  padding: 30px;
  border-radius: 16px;
  width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  position: relative;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-size: 1.8em;
  color: white;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 600;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #ddd;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  outline: none;
  transition: background-color 0.2s;

  &:focus {
    background-color: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: #bbb;
  }
`;

const UploadButton = styled.label`
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(255, 123, 179, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 123, 179, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Icon = styled.span`
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

const FileInfoContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;
`;

const FileName = styled.span`
  color: #ddd;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
`;

const FileTypeIndicator = styled.span`
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  margin-left: auto;
  background-color: ${(props) =>
    props.valid ? "rgba(76, 175, 80, 0.2)" : "rgba(255, 68, 68, 0.2)"};
  color: ${(props) => (props.valid ? "#4caf50" : "#ff4444")};
`;

const Select = styled.select`
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:focus {
    background-color: rgba(255, 255, 255, 0.15);
  }

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
  padding: 14px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 10px;
  box-shadow: 0 4px 10px rgba(255, 123, 179, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 123, 179, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: linear-gradient(135deg, #cf6394, #cf6376);
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const MessageText = styled.p`
  color: ${({ error }) => (error ? "#ff4444" : "#4caf50")};
  font-size: 14px;
  text-align: center;
  padding: 8px;
  background-color: ${({ error }) =>
    error ? "rgba(255, 68, 68, 0.1)" : "rgba(76, 175, 80, 0.1)"};
  border-radius: 6px;
  margin-top: 16px;
`;

const ImagePreviewContainer = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoImageText = styled.div`
  color: #bbb;
  font-size: 14px;
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
  const [audioError, setAudioError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const audioInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const validAudioFormats = [
    "audio/mpeg",
    "audio/wav",
    "audio/mp3",
    "audio/ogg",
    "audio/flac",
  ];
  const validImageFormats = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  const handleAudioChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (validAudioFormats.includes(selectedFile.type)) {
        setFile(selectedFile);
        setAudioError(false);
      } else {
        setFile(null);
        setAudioError(true);
        // Reset input
        if (audioInputRef.current) audioInputRef.current.value = "";
      }
    }
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (validImageFormats.includes(selectedFile.type)) {
        setImagem(selectedFile);
        setImageError(false);
        // Create preview URL
        setImagePreview(URL.createObjectURL(selectedFile));
      } else {
        setImagem(null);
        setImageError(true);
        setImagePreview(null);
        // Reset input
        if (imageInputRef.current) imageInputRef.current.value = "";
      }
    }
  };

  const onSubmitWrapper = (e) => {
    e.preventDefault();
    // Additional validation
    if (audioError || imageError) {
      setErrorMessage("Por favor, corrija os erros de formato de arquivo");
      return;
    }
    handlePublishSubmit(e);
  };

  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={() => setShowPublishPopup(false)}>
          <FaTimes />
        </CloseButton>
        <FormWrapper>
          <Title>Submeter Música</Title>
          <form onSubmit={onSubmitWrapper}>
            <InputGroup>
              <Label htmlFor="song-name">Nome da música</Label>
              <Input
                id="song-name"
                type="text"
                placeholder="Digite o nome da música"
                value={nomeMusica}
                onChange={(e) => setNomeMusica(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Arquivo de áudio</Label>
              <UploadButton htmlFor="file-upload">
                <Icon>
                  <FaMusic />
                </Icon>
                Selecionar arquivo de áudio
              </UploadButton>
              <Input
                id="file-upload"
                type="file"
                accept="audio/*"
                onChange={handleAudioChange}
                required
                style={{ display: "none" }}
                ref={audioInputRef}
              />
              {file && (
                <FileInfoContainer>
                  <FileName>{file.name}</FileName>
                  <FileTypeIndicator valid={!audioError}>
                    {!audioError ? "Formato válido" : "Formato inválido"}
                  </FileTypeIndicator>
                </FileInfoContainer>
              )}
              {audioError && (
                <MessageText error>
                  Por favor, selecione um arquivo de áudio válido (MP3, WAV,
                  OGG, FLAC)
                </MessageText>
              )}
            </InputGroup>

            <InputGroup>
              <Label>Imagem da capa</Label>
              <UploadButton htmlFor="image-upload">
                <Icon>
                  <FaImage />
                </Icon>
                Selecionar imagem de capa
              </UploadButton>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{ display: "none" }}
                ref={imageInputRef}
              />
              <ImagePreviewContainer>
                {imagePreview ? (
                  <ImagePreview src={imagePreview} alt="Preview da capa" />
                ) : (
                  <NoImageText>Nenhuma imagem selecionada</NoImageText>
                )}
              </ImagePreviewContainer>
              {imagem && (
                <FileInfoContainer>
                  <FileName>{imagem.name}</FileName>
                  <FileTypeIndicator valid={!imageError}>
                    {!imageError ? "Formato válido" : "Formato inválido"}
                  </FileTypeIndicator>
                </FileInfoContainer>
              )}
              {imageError && (
                <MessageText error>
                  Por favor, selecione uma imagem válida (JPG, PNG, WEBP)
                </MessageText>
              )}
            </InputGroup>

            <InputGroup>
              <Label htmlFor="category-select">Categoria</Label>
              <Select
                id="category-select"
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

            <SubmitButton
              type="submit"
              disabled={isSubmitting || audioError || imageError}
            >
              {isSubmitting ? "Enviando..." : "Publicar Música"}
            </SubmitButton>

            {errorMessage && (
              <MessageText error={true}>{errorMessage}</MessageText>
            )}
            {successMessage && <MessageText>{successMessage}</MessageText>}
          </form>
        </FormWrapper>
      </PopupContent>
    </PopupOverlay>
  );
};

export default PublishMusicForm;
