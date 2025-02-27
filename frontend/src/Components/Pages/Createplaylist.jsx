import React from "react";
import styled from "styled-components";
import { FaSearch, FaTimes } from "react-icons/fa";

// Estilos
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background: linear-gradient(to bottom, #2a2a4a, #1e1e2e);
  padding: 25px;
  border-radius: 12px;
  width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
  position: relative;
`;

const PopupTitle = styled.h2`
  font-size: 1.6em;
  color: #fff;
  margin-bottom: 20px;
  text-align: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #2c2c3a;
  color: #fff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #ff758c;
  }
`;

const FileUploadContainer = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px dashed #555;
  border-radius: 8px;
  background-color: #252535;
  cursor: pointer;
  margin-bottom: 15px;
  transition: border-color 0.3s;

  &:hover {
    border-color: #ff758c;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.span`
  color: #bbb;
  font-size: 14px;
  margin-top: 5px;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 150px;
  border-radius: 8px;
  margin-top: 10px;
  object-fit: cover;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: linear-gradient(135deg, #333, #555);
  border-radius: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 5px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #bbb;
  }
`;

const PopupMusicListContainer = styled.div`
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 5px;

  /* Scrollbar personalizada */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2a2a4a;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ff758c;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::-webkit-scrollbar-thumb {
    opacity: 1;
  }
`;

const PopupMusicItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3a3a5a, #2a2a4a);
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: linear-gradient(135deg, #504080, #6a5acd);
    transform: translateX(5px);
  }
`;

const MusicInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const MusicName = styled.span`
  font-weight: bold;
  color: #fff;
  font-size: 16px;
`;

const MusicArtist = styled.span`
  color: #ccc;
  font-size: 13px;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  color: #fff;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
  }
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  color: #fff;
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 15px;
`;

const CreatePlaylistForm = ({
  showPlaylistPopup,
  setShowPlaylistPopup,
  playlistName,
  setPlaylistName,
  imageFile,
  setImageFile,
  searchQueryPopup,
  setSearchQueryPopup,
  filteredSongsPopup,
  selectedSongs,
  handleSongSelection,
  createPlaylist,
}) => {
  // Pré-visualização da imagem
  const imagePreview = imageFile ? URL.createObjectURL(imageFile) : null;

  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={() => setShowPlaylistPopup(false)}>
          <FaTimes />
        </CloseButton>
        <PopupTitle>Criar Nova Playlist</PopupTitle>
        <StyledInput
          type="text"
          placeholder="Nome da Playlist"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <FileUploadContainer>
          <span>{imageFile ? imageFile.name : "Escolhe uma imagem"}</span>
          <FileLabel>(JPG, PNG, etc.)</FileLabel>
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          {imagePreview && (
            <PreviewImage src={imagePreview} alt="Pré-visualização" />
          )}
        </FileUploadContainer>
        <SearchContainer>
          <FaSearch style={{ marginRight: "10px", color: "#bbb" }} />
          <SearchInput
            type="text"
            placeholder="Procurar músicas"
            value={searchQueryPopup}
            onChange={(e) => setSearchQueryPopup(e.target.value)}
          />
        </SearchContainer>
        <PopupMusicListContainer>
          {filteredSongsPopup.map((song) => (
            <PopupMusicItem key={song._id}>
              <MusicInfo>
                <MusicName>{song.nome}</MusicName>
                <MusicArtist>{song.artista}</MusicArtist>
              </MusicInfo>
              <ActionButton onClick={() => handleSongSelection(song._id)}>
                {selectedSongs.includes(song._id) ? "Remover" : "Adicionar"}
              </ActionButton>
            </PopupMusicItem>
          ))}
        </PopupMusicListContainer>
        <CreateButton onClick={createPlaylist}>Criar Playlist</CreateButton>
      </PopupContent>
    </PopupOverlay>
  );
};

export default CreatePlaylistForm;
