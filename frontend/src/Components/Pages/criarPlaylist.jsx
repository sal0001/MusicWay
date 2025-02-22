import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styled from "styled-components";
import Navbar2 from "../navbar/navbar2";
import {
  FaMusic,
  FaAddressCard,
  FaInfoCircle,
  FaUserCircle,
} from "react-icons/fa";

const PlaylistPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  width: 100%;
  background: linear-gradient(to bottom, #d3d3d3, grey);
  min-height: 100vh;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px auto;
  padding: 5px 10px;
  background-color: #333;
  border-radius: 25px;
  width: 80%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SearchIcon = styled.i`
  font-size: 20px;
  color: #bbb;
  margin-left: 10px;
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

  &:focus {
    border: none;
    outline: none;
  }
`;

const MusicListContainer = styled.div`
  width: 70%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const MusicItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-radius: 10px;
  background-color: #333;
  margin: 10px;
  width: 45%;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #444;
    transform: translateX(5px);
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
  background-color: #444;
  border: none;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #555;
  }
`;

const PlaylistForm = styled.div`
  margin-top: 20px;
  width: 80%;
`;

const PlaylistNameInput = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 18px;
  border-radius: 5px;
  border: 1px solid #333;
  margin-bottom: 10px;
  background-color: #333;
  color: white;
  outline: none;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
  }
`;

const CreatePlaylistButton = styled.button`
  background-color: #555;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #666;
  }
`;

const RightSidebarContainer = styled.div`
  width: 170px;
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

const ImageUploadInput = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  border: none;
  background-color: #333;
  color: white;
  border-radius: 5px;

  &::-webkit-file-upload-button {
    padding: 5px 10px;
    background-color: #444;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const CreatePlaylistPage = () => {
  const [songs, setSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const fetchSongs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/musicas");
      if (!response.ok) {
        throw new Error("Falha ao buscar músicas: " + response.statusText);
      }
      const data = await response.json();
      const approvedSongs = data.filter((song) => song.status === "aprovado");
      setSongs(approvedSongs);
    } catch (error) {
      console.error("Erro ao buscar músicas:", error.message);
    }
  };

  useEffect(() => {
    fetchSongs();

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchUserId = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://127.0.0.1:3001/auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.authenticated) {
          setUserId(data.user.userId);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário autenticado:", error.message);
      }
    }
  };

  const handleSongSelection = (song) => {
    setSelectedSongs((prevSelectedSongs) =>
      prevSelectedSongs.includes(song._id)
        ? prevSelectedSongs.filter((selectedSong) => selectedSong !== song._id)
        : [...prevSelectedSongs, song._id]
    );
  };

  const createPlaylist = async () => {
    if (!playlistName.trim() || !imageFile) {
      alert("O nome da playlist e a imagem são obrigatórios.");
      return;
    }

    if (selectedSongs.length === 0) {
      alert("Selecione ao menos uma música para a playlist.");
      return;
    }

    if (!userId) {
      alert("Usuário não autenticado. Faça login para criar uma playlist.");
      return;
    }

    const formData = new FormData();
    formData.append("nome", playlistName.trim());
    formData.append("utilizador", userId);
    formData.append("imagem", imageFile);
    formData.append("musicas", JSON.stringify(selectedSongs));

    try {
      const response = await fetch("http://127.0.0.1:3001/addPlaylist", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setFeedbackMessage("Playlist criada com sucesso!");
        setPlaylistName("");
        setSelectedSongs([]);
        setImageFile(null);
      } else {
        setFeedbackMessage("Erro ao criar playlist.");
      }
    } catch (error) {
      console.error("Erro ao criar playlist:", error.message);
      alert("Erro ao criar playlist. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchUserId();
  }, []);

  return (
    <div>
      <Navbar2 />
      <PlaylistPageContainer>
        <PlaylistForm>
          {feedbackMessage && (
            <div
              style={{
                color: feedbackMessage.includes("sucesso") ? "green" : "red",
                margin: "10px 0",
                textAlign: "center",
              }}
            >
              {feedbackMessage}
            </div>
          )}
          <PlaylistNameInput
            type="text"
            placeholder="Nome"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
          <ImageUploadInput
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <CreatePlaylistButton onClick={createPlaylist}>
            Criar Playlist
          </CreatePlaylistButton>
        </PlaylistForm>
        <SearchContainer>
          <SearchIcon className="fa fa-search" />
          <SearchInput
            type="text"
            placeholder="Procurar músicas"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>

        <MusicListContainer>
          {songs
            .filter((song) =>
              song.nome.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((song) => (
              <MusicItem key={song._id}>
                <div>
                  <MusicName>{song.nome}</MusicName>
                  <br />
                  <MusicArtist>{song.artista}</MusicArtist>
                </div>
                <AddToPlaylistButton onClick={() => handleSongSelection(song)}>
                  {selectedSongs.includes(song._id) ? "Remover" : "Adicionar"}
                </AddToPlaylistButton>
              </MusicItem>
            ))}
        </MusicListContainer>
        {isLoggedIn ? (
          <RightSidebarContainer>
            <SidebarTitle></SidebarTitle>
            <SidebarLink href="/main/Perfil">
              <FaUserCircle style={{ marginRight: "8px" }} />
              Perfil
            </SidebarLink>
            <SidebarLink href="/adicionarMusicas">
              <FaMusic style={{ marginRight: "8px" }} />
              Publicar
            </SidebarLink>
            <SidebarLink href="/Sobrenos">
              <FaInfoCircle style={{ marginRight: "8px" }} />
              Contactar
            </SidebarLink>
          </RightSidebarContainer>
        ) : (
          <RightSidebarContainer>
            <SidebarTitle></SidebarTitle>
          </RightSidebarContainer>
        )}
      </PlaylistPageContainer>
    </div>
  );
};

export default CreatePlaylistPage;
