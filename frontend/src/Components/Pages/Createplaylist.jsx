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

const PopupTitle = styled.h2`
  font-size: 1.5em;
  color: white;
  margin-bottom: 20px;
`;

const PopupInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px auto;
  padding: 8px 12px;
  background: linear-gradient(135deg, #333, #555);
  border-radius: 25px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 25px;
  background-color: transparent;
  color: white;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #bbb;
  }
`;

const PopupMusicListContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-top: 10px;
`;

const PopupMusicItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3a3a5a, #2a2a4a);
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: linear-gradient(135deg, #504080, #6a5acd);
    transform: scale(1.01);
  }
`;

const MusicName = styled.span`
  font-weight: bold;
  color: #fff;
  font-size: 18px;
`;

const MusicArtist = styled.span`
  color: #bbb;
  font-size: 14px;
`;

const AddToPlaylistButton = styled.button`
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
  }
`;

const CreatePlaylistButton = styled.button`
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  color: white;
  width: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
  }
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
  return (
    <PopupOverlay>
      <PopupContent>
        <CloseButton onClick={() => setShowPlaylistPopup(false)}>
          &times;
        </CloseButton>
        <PopupTitle>Criar Nova Playlist</PopupTitle>
        <PopupInput
          type="text"
          placeholder="Nome da Playlist"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <p style={{ color: "white", marginBottom: "0" }}>
          Selecione uma imagem:
        </p>
        <PopupInput
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <SearchContainer>
          <FaSearch style={{ marginRight: "10px" }} />
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
              <div>
                <MusicName>{song.nome}</MusicName>
                <br />
                <MusicArtist>{song.artista}</MusicArtist>
              </div>
              <AddToPlaylistButton
                onClick={() => handleSongSelection(song._id)}
              >
                {selectedSongs.includes(song._id) ? "Remover" : "Adicionar"}
              </AddToPlaylistButton>
            </PopupMusicItem>
          ))}
        </PopupMusicListContainer>
        <CreatePlaylistButton onClick={createPlaylist}>
          Criar Playlist
        </CreatePlaylistButton>
      </PopupContent>
    </PopupOverlay>
  );
};

export default CreatePlaylistForm;
