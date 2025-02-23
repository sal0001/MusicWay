import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaMusic,
  FaInfoCircle,
  FaUserCircle,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar2 from "../navbar/navbar2";
import styled from "styled-components";
import MiniPlayer from "./MiniPlayer";
import axios from "axios";

// Estilos
const AddPlaylistButton = styled.button`
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  color: white;
  font-size: 0.7em;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
    transform: scale(1.1);
  }
`;

const SidebarContainer = styled.div`
  width: 400px;
  height: 100vh;
  background: linear-gradient(to bottom, #1e1e2e, #3a3a5a);
  color: white;
  padding: 20px;
  position: fixed;
  top: 70px;
  left: 0;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 250px;
  }

  @media (max-width: 480px) {
    width: 200px;
  }
`;

const RightSidebarContainer = styled.div`
  width: 170px;
  height: 100vh;
  background: linear-gradient(to bottom, #1e1e2e, #3a3a5a);
  color: white;
  padding: 20px;
  position: fixed;
  top: 70px;
  right: 0;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    width: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
  }
`;

const MusicListContainer = styled.div`
  margin-left: 400px;
  margin-right: 170px;
  padding: 20px;
  flex: 1;
  margin-top: 60px;
  width: 100%;
  transition: margin 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 250px;
    margin-right: 120px;
  }

  @media (max-width: 480px) {
    margin-left: 200px;
    margin-right: 100px;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.5em;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #444, #555);
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
`;

const SidebarLink = styled.a`
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 15px;
  background: transparent;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.3s, padding-left 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff7eb3, #ff758c);
    padding-left: 20px;
  }
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

const MusicItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3a3a5a, #2a2a4a);
  margin-bottom: 15px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;

  &:hover {
    background: linear-gradient(135deg, #504080, #6a5acd);
    transform: scale(1.01);
  }
`;

const PageContainer = styled.div`
  background: linear-gradient(to bottom, #2a2a4a, #1e1e2e);
  min-height: 100vh;
`;

const SearchIcon = styled.i`
  font-size: 20px;
  color: #bbb;
  margin-left: 10px;
`;

const DropdownContainer = styled.select`
  padding: 8px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 10px;
  margin-left: 10px;
  font-size: 16px;
  outline: none;

  option {
    background-color: #333;
    color: white;
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

const PlayButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 24px;
  margin-left: 15px;
  transition: color 0.3s;

  &:hover {
    color: #ccc;
  }
`;

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

const PopupButton = styled.button`
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
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

const PlaylistNameInput = styled(PopupInput)``;
const ImageUploadInput = styled(PopupInput)``;
const AddToPlaylistButton = styled(PopupButton)`
  padding: 8px 16px;
  font-size: 14px;
`;
const CreatePlaylistButton = styled(PopupButton)`
  width: 100%;
  margin-top: 10px;
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

// Componentes adicionais para o popup de publicação
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
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;

  &:hover {
    background: linear-gradient(135deg, #ff568c, #ff3d6e);
  }
`;

const MessageText = styled.p`
  color: ${({ error }) => (error ? "#ff4444" : "#4caf50")};
  font-size: 14px;
  text-align: center;
`;

// Componente Principal
const Main = () => {
  const [publishedSongs, setPublishedSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const audioRef = useRef(null);
  const [playlists, setPlaylists] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylistPopup, setShowPlaylistPopup] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const [nomeMusica, setNomeMusica] = useState("");
  const [artista, setArtista] = useState("");
  const [file, setFile] = useState(null);
  const [categoriaId, setCategoriaId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQueryPopup, setSearchQueryPopup] = useState("");

  // Função para buscar músicas
  const fetchSongs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/musicas");
      if (!response.ok) {
        throw new Error("Failed to fetch songs: " + response.statusText);
      }
      const data = await response.json();

      const approvedSongs = data.filter((song) => song.status === "aprovado");

      const songsWithUrls = approvedSongs.map((song) => ({
        ...song,
        url: `http://127.0.0.1:3001/musicas/${song.ficheiro}`,
      }));

      setPublishedSongs(songsWithUrls);
    } catch (error) {
      console.error("Error fetching songs:", error.message);
    }
  };

  // Função para buscar playlists
  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = new Headers();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const response = await fetch("http://127.0.0.1:3001/playlists", {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch playlists: " + response.statusText);
      }

      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error.message);
    }
  };

  // Função para buscar categorias
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/getCategorias");
      if (!response.ok) {
        throw new Error("Failed to fetch categories: " + response.statusText);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  // Função para buscar o ID do usuário
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

  // Função para criar uma nova playlist
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
        alert("Playlist criada com sucesso!");
        setPlaylistName("");
        setSelectedSongs([]);
        setImageFile(null);
        setShowPlaylistPopup(false);
        fetchPlaylists(); // Atualiza a lista de playlists
      } else {
        alert("Erro ao criar playlist.");
      }
    } catch (error) {
      console.error("Erro ao criar playlist:", error.message);
      alert("Erro ao criar playlist. Tente novamente mais tarde.");
    }
  };

  // Função para controlar play/pause
  const handlePlayPause = (song) => {
    if (currentTrack && currentTrack.ficheiro === song.ficheiro) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch((error) => {
          console.error("Erro ao tentar retomar a música:", error);
        });
      } else {
        audioRef.current.pause();
      }
    } else {
      setCurrentTrack(song);
      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.load();
        audioRef.current.play().catch((error) => {
          console.error("Erro ao tentar tocar a nova música:", error);
        });
      }
    }
    setIsPlaying(!audioRef.current?.paused);
  };

  // Função para selecionar/deselecionar músicas
  const handleSongSelection = (songId) => {
    setSelectedSongs((prevSelectedSongs) =>
      prevSelectedSongs.includes(songId)
        ? prevSelectedSongs.filter((id) => id !== songId)
        : [...prevSelectedSongs, songId]
    );
  };

  // Função para lidar com o envio do formulário de publicação
  const handlePublishSubmit = async (event) => {
    event.preventDefault();
    if (!nomeMusica || !artista || !file || !categoriaId) {
      setErrorMessage("Preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("nome", nomeMusica);
    formData.append("artista", artista);
    formData.append("categoriaId", categoriaId);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/addMusicas",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.musica && response.data.musica.status === "pendente") {
        setSuccessMessage(
          "Música publicada com sucesso e está pendente de aprovação!"
        );
      } else {
        setSuccessMessage("Música publicada com sucesso!");
      }

      setNomeMusica("");
      setFile(null);
      setCategoriaId("");
      setShowPublishPopup(false); // Fechar o popup após o envio
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response?.data?.message || "Erro ao publicar música"
        );
      } else {
        setErrorMessage("Erro desconhecido ao tentar publicar música.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers = new Headers();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      setIsLoggedIn(true);
    }

    fetchSongs(headers);
    fetchCategories(headers);
    fetchPlaylists(headers);
    fetchUserId();

    // Busca o nome do usuário logado e preenche o campo "artista"
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const userObject = JSON.parse(loggedInUser);
      setArtista(userObject.nome); // Preenche o campo "artista" com o nome do usuário
    }
  }, []);

  // Filtro de músicas para a lista principal
  const filteredSongs = publishedSongs.filter((song) => {
    const matchesSearch = song.nome
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? song.categoria === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Filtro de músicas para o popup de criação de playlist
  const filteredSongsPopup = publishedSongs.filter((song) =>
    song.nome.toLowerCase().includes(searchQueryPopup.toLowerCase())
  );

  return (
    <div>
      <PageContainer>
        <Navbar2 />
        <div style={{ display: "flex" }}>
          <SidebarContainer>
            {isLoggedIn ? (
              <>
                <br />
                <SidebarTitle>
                  Playlists
                  <div style={{ display: "flex", gap: "10px" }}>
                    <AddPlaylistButton
                      onClick={() => setShowPlaylistPopup(true)}
                    >
                      <FaPlus />
                    </AddPlaylistButton>
                    <AddPlaylistButton
                      onClick={() => setShowPublishPopup(true)}
                    >
                      <FaMusic />
                    </AddPlaylistButton>
                  </div>
                </SidebarTitle>
                <br />

                {playlists.map((playlist) => (
                  <SidebarLink
                    key={playlist._id}
                    href={`/playlist/${playlist._id}`}
                  >
                    <img
                      src={`http://127.0.0.1:3001/imagens/${playlist.imagem}`}
                      alt={playlist.nome}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        marginRight: "10px",
                      }}
                    />
                    {playlist.nome}
                  </SidebarLink>
                ))}
              </>
            ) : (
              <div>
                <br />
                <p>Registe-se ou faça login para ver as suas playlists</p>
              </div>
            )}
          </SidebarContainer>

          <MusicListContainer>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SearchContainer>
                <FaSearch style={{ marginRight: "10px" }} />
                <SearchInput
                  type="text"
                  placeholder="Pesquisa por músicas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchContainer>
              <DropdownContainer
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nome}
                  </option>
                ))}
              </DropdownContainer>
            </div>
            {filteredSongs.map((song) => (
              <MusicItem key={song._id} onClick={() => handlePlayPause(song)}>
                <MusicName>{song.nome}</MusicName>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MusicArtist>{song.artista}</MusicArtist>
                  <PlayButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause(song);
                    }}
                  >
                    <i
                      className={
                        currentTrack &&
                        currentTrack.ficheiro === song.ficheiro &&
                        !audioRef.current?.paused
                          ? "fas fa-pause"
                          : "fas fa-play"
                      }
                    ></i>
                  </PlayButton>
                </div>
              </MusicItem>
            ))}
          </MusicListContainer>

          {isLoggedIn ? (
            <RightSidebarContainer>
              <br />
              <SidebarLink href="/main/Perfil">
                <FaUserCircle style={{ marginRight: "8px" }} />
                Perfil
              </SidebarLink>
              <SidebarLink href="/Sobrenos">
                <FaInfoCircle style={{ marginRight: "8px" }} />
                Contactar
              </SidebarLink>
            </RightSidebarContainer>
          ) : (
            <RightSidebarContainer>
              <br />
              <SidebarLink href="/Sobrenos">
                <FaInfoCircle style={{ marginRight: "8px" }} />
                Contactar
              </SidebarLink>
            </RightSidebarContainer>
          )}
        </div>
      </PageContainer>

      {showPlaylistPopup && (
        <PopupOverlay>
          <PopupContent>
            <CloseButton onClick={() => setShowPlaylistPopup(false)}>
              &times;
            </CloseButton>
            <PopupTitle>Criar Nova Playlist</PopupTitle>
            <PlaylistNameInput
              type="text"
              placeholder="Nome da Playlist"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <ImageUploadInput
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
      )}

      {showPublishPopup && (
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
      )}

      <MiniPlayer
        currentTrack={currentTrack}
        audioRef={audioRef}
        onPlayPause={handlePlayPause}
        onTrackEnd={() => setCurrentTrack(null)}
        isPlaying={isPlaying}
      />
      <audio ref={audioRef} onEnded={() => setCurrentTrack(null)} />
    </div>
  );
};

export default Main;
