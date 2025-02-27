import React, { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaMusic,
  FaSearch,
  FaTimes,
  FaPlay,
  FaPause,
  FaImage,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar2 from "../navbar/navbar2";
import styled, { keyframes } from "styled-components";
import MiniPlayer from "./MiniPlayer";
import axios from "axios";
import CreatePlaylistForm from "./Createplaylist";
import PublishMusicForm from "./Addmusic";

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const PageContainer = styled.div`
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const MainContent = styled.div`
  display: flex;
  position: relative;
  height: calc(100vh - 70px);
  margin-top: 70px;
  width: 100%;

  @media (max-width: 768px) {
    overflow-x: hidden;
  }
`;

const SidebarContainer = styled.div`
  width: 300px;
  height: 100%;
  margin-top: 13px;
  background: rgba(30, 30, 46, 0.9);
  backdrop-filter: blur(12px);
  color: white;
  padding: 15px;
  position: fixed;
  overflow-y: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    width: 280px;
    transform: ${({ isOpen }) =>
      isOpen ? "translateX(0)" : "translateX(-100%)"};
    height: calc(100% - 70px);
    top: 70px;
    left: 0;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SidebarToggle = styled.button`
  background: rgba(255, 118, 140, 0.9);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(255, 86, 140, 1);
    transform: scale(1.1);
  }

  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    position: fixed;
    z-index: 1100;
    left: 15px;
    top: 90px;
  }
`;

const Overlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 900;
  transition: opacity 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MusicListContainer = styled.div`
  flex: 1;
  margin-top: 20px;
  padding: 20px;
  overflow-y: auto;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  height: calc(100vh - 70px);
  margin-left: ${({ sidebarOpen }) => (sidebarOpen ? "300px" : "0")};
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 60px 15px 15px 15px;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.6em;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    rgba(68, 68, 85, 0.7),
    rgba(85, 85, 102, 0.7)
  );
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  margin-top: ${({ isOpen }) => (isOpen ? "20px" : "60px")};
`;

const SidebarLink = styled.a`
  display: flex;
  margin-top: 15px;
  align-items: center;
  padding: 12px 15px;
  background: rgba(58, 58, 90, 0.5);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(255, 86, 140, 0.8),
      rgba(255, 61, 110, 0.8)
    );
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const PlaylistImage = styled.img`
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const PlaylistName = styled.span`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(51, 51, 85, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 50px;
  padding: 0 15px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(255, 123, 179, 0.6);
    background: rgba(51, 51, 85, 0.9);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: none;
  border-radius: 50px;
  background-color: transparent;
  color: white;
  font-size: 15px;
  outline: none;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const CategorySelect = styled.select`
  padding: 12px 15px;
  background: rgba(51, 51, 85, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  font-size: 15px;
  outline: none;
  min-width: 120px;
  max-width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 0 0 0 2px rgba(255, 123, 179, 0.6);
  }

  option {
    background-color: #2a2a4a;
    color: white;
  }
`;

const MusicListWrapper = styled.div`
  background: rgba(30, 30, 46, 0.9);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.3s ease-out;
  flex: 1;
  overflow-y: auto;
`;

const MusicItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  background: linear-gradient(
    145deg,
    rgba(58, 58, 90, 0.6),
    rgba(40, 40, 60, 0.6)
  );
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(
      145deg,
      rgba(255, 86, 140, 0.4),
      rgba(255, 61, 110, 0.4)
    );
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }
`;

const MusicCover = styled.div`
  width: 70px;
  height: 70px;
  background: ${(props) =>
    props.image
      ? `url(${props.image}) no-repeat center/cover`
      : "linear-gradient(135deg, #5b6cd6, #ff758c)"};
  border-radius: 8px;
  margin-right: 20px;
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    margin-bottom: 12px;
  }
`;

const MusicInfo = styled.div`
  flex: 1;
  min-width: 0;
  padding-right: 20px;

  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

const MusicTitle = styled.h3`
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const MusicDetails = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 6px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MusicActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
    margin-top: 10px;
  }
`;

const PlayButton = styled.button`
  background: linear-gradient(45deg, #ff6f61, #ff8779);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: linear-gradient(45deg, #ff8779, #ff6f61);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: linear-gradient(
    135deg,
    rgba(255, 126, 179, 0.9),
    rgba(255, 117, 140, 0.9)
  );
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.1);
    background: linear-gradient(
      135deg,
      rgba(255, 86, 140, 1),
      rgba(255, 61, 110, 1)
    );
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  svg {
    font-size: 16px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding: 10px 0;
`;

const PageButton = styled.button`
  background: ${(props) =>
    props.active
      ? "linear-gradient(45deg, #ff6f61, #ff8779)"
      : "rgba(58, 58, 90, 0.6)"};
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${(props) =>
      props.active
        ? "linear-gradient(45deg, #ff8779, #ff6f61)"
        : "rgba(58, 58, 90, 0.8)"};
    transform: scale(1.1);
  }

  &:disabled {
    background: rgba(58, 58, 90, 0.3);
    cursor: not-allowed;
    transform: none;
  }
`;

const PageNumber = styled.span`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.7);
`;

const LoginPrompt = styled.div`
  background: rgba(30, 30, 60, 0.8);
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  margin-top: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const LoginButton = styled.a`
  display: inline-block;
  background: linear-gradient(135deg, #ff7eb3, #ff758c);
  color: white;
  padding: 12px 25px;
  border-radius: 50px;
  margin-top: 15px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ff6f61;
  animation: spin 1s ease-in-out infinite;
  margin-right: 12px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Main = () => {
  const [publishedSongs, setPublishedSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const [imagem, setImagem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this value based on how many items you want per page

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:3001/musicas");
      if (!response.ok)
        throw new Error("Failed to fetch songs: " + response.statusText);
      const data = await response.json();
      const approvedSongs = data.filter((song) => song.status === "aprovado");
      const songsWithUrls = approvedSongs.map((song) => ({
        ...song,
        url: `http://127.0.0.1:3001/musicas/${song.ficheiro}`,
        coverUrl: song.imagem
          ? `http://127.0.0.1:3001/musicas/${song.imagem}`
          : null,
      }));
      setPublishedSongs(songsWithUrls);
    } catch (error) {
      console.error("Error fetching songs:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = new Headers();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      const response = await fetch("http://127.0.0.1:3001/playlists", {
        method: "GET",
        headers,
      });
      if (!response.ok)
        throw new Error("Failed to fetch playlists: " + response.statusText);
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/getCategorias");
      if (!response.ok)
        throw new Error("Failed to fetch categories: " + response.statusText);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  const fetchUserId = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch("http://127.0.0.1:3001/auth", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.authenticated) setUserId(data.user.userId);
      } catch (error) {
        console.error("Erro ao buscar usuário autenticado:", error.message);
      }
    }
  };

  const createPlaylist = async () => {
    if (!playlistName.trim() || !imageFile) {
      setErrorMessage("Nome da playlist e imagem são obrigatórios");
      return;
    }
    if (selectedSongs.length === 0) {
      setErrorMessage("Selecione pelo menos uma música");
      return;
    }
    if (!userId) {
      setErrorMessage("Usuário não autenticado");
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
        setSuccessMessage("Playlist criada com sucesso!");
        setPlaylistName("");
        setSelectedSongs([]);
        setImageFile(null);
        setShowPlaylistPopup(false);
        fetchPlaylists();
      } else {
        setErrorMessage("Erro ao criar playlist");
      }
    } catch (error) {
      setErrorMessage("Erro ao criar playlist: " + error.message);
    }
  };

  const handlePlayPause = (song) => {
    if (currentTrack && currentTrack.ficheiro === song.ficheiro) {
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .catch((error) =>
            console.error("Erro ao tentar retomar a música:", error)
          );
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setCurrentTrack(song);
      if (audioRef.current) {
        audioRef.current.src = song.url;
        audioRef.current.load();
        audioRef.current
          .play()
          .catch((error) =>
            console.error("Erro ao tentar tocar a nova música:", error)
          );
        setIsPlaying(true);
      }
    }
  };

  const handleSongSelection = (songId) => {
    setSelectedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const handleLikeSong = (songId) => {
    setLikedSongs((prev) =>
      prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId]
    );
  };

  const handlePublishSubmit = async (event) => {
    event.preventDefault();
    if (!nomeMusica || !artista || !file || !categoriaId) {
      setErrorMessage("Preencha todos os campos obrigatórios.");
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("nome", nomeMusica);
    formData.append("artista", artista);
    formData.append("categoriaId", categoriaId);
    if (imagem) formData.append("imagem", imagem);
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://127.0.0.1:3001/addMusicas",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccessMessage("Música enviada com sucesso!");
      setTimeout(() => {
        setNomeMusica("");
        setFile(null);
        setImagem(null);
        setCategoriaId("");
        setShowPublishPopup(false);
        fetchSongs();
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erro ao publicar música"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
    fetchSongs();
    fetchCategories();
    fetchPlaylists();
    fetchUserId();
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const userObject = JSON.parse(loggedInUser);
      setArtista(userObject.nome);
    }
  }, []);

  const filteredSongs = publishedSongs.filter((song) => {
    const matchesSearch =
      song.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artista.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? song.categoria === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const filteredSongsPopup = publishedSongs.filter(
    (song) =>
      song.nome.toLowerCase().includes(searchQueryPopup.toLowerCase()) ||
      song.artista.toLowerCase().includes(searchQueryPopup.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSongs = filteredSongs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleOverlayClick = () => {
    if (isMobile && sidebarOpen) setSidebarOpen(false);
  };

  return (
    <PageContainer>
      <Navbar2 />
      <MainContent>
        <SidebarToggle onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaPlus />}
        </SidebarToggle>

        <SidebarContainer isOpen={sidebarOpen}>
          {isLoggedIn ? (
            <>
              <SidebarTitle isOpen={sidebarOpen}>
                Playlists
                <ActionButtonGroup>
                  <ActionButton
                    onClick={() => setShowPlaylistPopup(true)}
                    title="Criar Playlist"
                  >
                    <FaPlus />
                  </ActionButton>
                  <ActionButton
                    onClick={() => setShowPublishPopup(true)}
                    title="Adicionar Música"
                  >
                    <FaMusic />
                  </ActionButton>
                </ActionButtonGroup>
              </SidebarTitle>
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <SidebarLink
                    key={playlist._id}
                    href={`/playlist/${playlist._id}`}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    <PlaylistImage
                      src={`http://127.0.0.1:3001/imagens/${playlist.imagem}`}
                      alt={playlist.nome}
                    />
                    <PlaylistName>{playlist.nome}</PlaylistName>
                  </SidebarLink>
                ))
              ) : (
                <EmptyMessage>
                  Ainda não tens playlists. Cria uma nova!
                </EmptyMessage>
              )}
            </>
          ) : (
            <LoginPrompt>
              <h3>Playlists</h3>
              <p>Faz login para criar e gerenciar as tuas playlists.</p>
              <LoginButton href="/login">Entrar</LoginButton>
            </LoginPrompt>
          )}
        </SidebarContainer>

        <Overlay
          isOpen={sidebarOpen && isMobile}
          onClick={handleOverlayClick}
        />

        <MusicListContainer sidebarOpen={!isMobile && sidebarOpen}>
          <FilterContainer>
            <SearchContainer>
              <FaSearch style={{ color: "white", fontSize: "16px" }} />
              <SearchInput
                type="text"
                placeholder="Pesquisar por músicas ou artistas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
            <CategorySelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tudo</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.nome}
                </option>
              ))}
            </CategorySelect>
          </FilterContainer>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "40px", flex: 1 }}>
              <LoadingSpinner />
              <span style={{ color: "white" }}>Carregando músicas...</span>
            </div>
          ) : filteredSongs.length > 0 ? (
            <>
              <MusicListWrapper>
                {currentSongs.map((song) => {
                  const categoryName =
                    categories.find((cat) => cat._id === song.categoria)
                      ?.nome || "Sem categoria";
                  return (
                    <MusicItem key={song._id}>
                      <MusicCover image={song.coverUrl}>
                        {!song.coverUrl && (
                          <FaMusic
                            size={30}
                            color="white"
                            style={{ position: "relative", zIndex: 2 }}
                          />
                        )}
                      </MusicCover>
                      <MusicInfo onClick={() => handlePlayPause(song)}>
                        <MusicTitle>{song.nome}</MusicTitle>
                        <MusicDetails>
                          {song.artista} • {categoryName}
                        </MusicDetails>
                      </MusicInfo>
                      <MusicActions>
                        <PlayButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause(song);
                          }}
                        >
                          {currentTrack &&
                          currentTrack.ficheiro === song.ficheiro &&
                          isPlaying ? (
                            <FaPause />
                          ) : (
                            <FaPlay />
                          )}
                        </PlayButton>
                      </MusicActions>
                    </MusicItem>
                  );
                })}
              </MusicListWrapper>
              {totalPages > 1 && (
                <PaginationContainer>
                  <PageButton
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </PageButton>
                  <PageNumber>
                    {currentPage} de {totalPages}
                  </PageNumber>
                  <PageButton
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </PageButton>
                </PaginationContainer>
              )}
            </>
          ) : (
            <NoResultsMessage>
              {searchQuery || selectedCategory
                ? "Nenhuma música encontrada com os filtros selecionados."
                : "Nenhuma música disponível no momento."}
            </NoResultsMessage>
          )}
        </MusicListContainer>
      </MainContent>

      {showPlaylistPopup && (
        <CreatePlaylistForm
          showPlaylistPopup={showPlaylistPopup}
          setShowPlaylistPopup={setShowPlaylistPopup}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          imageFile={imageFile}
          setImageFile={setImageFile}
          searchQueryPopup={searchQueryPopup}
          setSearchQueryPopup={setSearchQueryPopup}
          filteredSongsPopup={filteredSongsPopup}
          selectedSongs={selectedSongs}
          handleSongSelection={handleSongSelection}
          createPlaylist={createPlaylist}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      )}

      {showPublishPopup && (
        <PublishMusicForm
          showPublishPopup={showPublishPopup}
          setShowPublishPopup={setShowPublishPopup}
          nomeMusica={nomeMusica}
          setNomeMusica={setNomeMusica}
          artista={artista}
          setArtista={setArtista}
          file={file}
          setFile={setFile}
          categoriaId={categoriaId}
          setCategoriaId={setCategoriaId}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          handlePublishSubmit={handlePublishSubmit}
          imagem={imagem}
          setImagem={setImagem}
          categories={categories}
        />
      )}

      <MiniPlayer
        currentTrack={currentTrack}
        audioRef={audioRef}
        onPlayPause={handlePlayPause}
        onTrackEnd={() => {
          setCurrentTrack(null);
          setIsPlaying(false);
        }}
        isPlaying={isPlaying}
      />

      <audio
        ref={audioRef}
        onEnded={() => {
          setCurrentTrack(null);
          setIsPlaying(false);
        }}
      />
    </PageContainer>
  );
};

export default Main;
