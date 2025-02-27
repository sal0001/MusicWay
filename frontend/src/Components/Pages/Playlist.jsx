import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar2 from "../navbar/navbar2";
import MiniPlayer from "./MiniPlayer";
import styled from "styled-components";
import {
  FaMusic,
  FaInfoCircle,
  FaUserCircle,
  FaTimes,
  FaPlus,
  FaTrash,
  FaPlay,
  FaPause,
} from "react-icons/fa";

// Modern gradient background with improved color scheme
const MainPage = styled.div`
  background: linear-gradient(135deg, #1a1a2e, #16213e, #1a1a2e);
  width: 100%;
  min-height: 100vh;
  color: white;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Poppins", sans-serif;
`;

// Improved container with better spacing
const PlaylistContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin-top: 100px;
  padding: 30px;
  border-radius: 20px;
  background: rgba(30, 30, 60, 0.5);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 95%;
    padding: 20px;
    margin-top: 80px;
  }
`;

// Header section with playlist details
const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

// Enhanced playlist image with better hover effects
const PlaylistImage = styled.img`
  width: 180px;
  height: 180px;
  border-radius: 20px;
  object-fit: cover;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

// Playlist info section
const PlaylistInfo = styled.div`
  flex: 1;
`;

const PlaylistTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(90deg, #fff, #b3b3ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Improved button container with flex layout
const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

// Enhanced button styles with better hover effects
const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

// Add music button
const AddMusicButton = styled(ActionButton)`
  background: linear-gradient(45deg, #4caf50, #2e7d32);
  color: white;

  &:hover {
    background: linear-gradient(45deg, #2e7d32, #1b5e20);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(46, 125, 50, 0.4);
  }
`;

// Delete playlist button
const RemovePlaylistButton = styled(ActionButton)`
  background: linear-gradient(45deg, #f44336, #d32f2f);
  color: white;

  &:hover {
    background: linear-gradient(45deg, #d32f2f, #b71c1c);
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(211, 47, 47, 0.4);
  }
`;

// Improved music list with better spacing
const MusicList = styled.div`
  margin-top: 30px;
  width: 100%;
  margin-bottom: 150px; // Space for the mini player
`;

// Enhanced music item with better hover effects and transitions
const MusicItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(44, 44, 84, 0.6);
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-left: 4px solid transparent;

  &:hover {
    background: rgba(51, 51, 115, 0.8);
    transform: translateX(5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    border-left-color: #b3b3ff;
  }
`;

// Music details section with improved spacing
const MusicDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0; // Prevent text overflow
`;

// Music title with truncation for long text
const MusicName = styled.span`
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Artist name with better styling
const MusicArtist = styled.span`
  font-size: 14px;
  color: #b3b3ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// Action buttons container
const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

// Play button with improved styling
const PlayButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    color: #b3b3ff;
  }
`;

// Remove button with improved styling
const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 18px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 107, 107, 0.1);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
    transform: scale(1.1);
    color: #ff4d4d;
  }
`;

// Improved modal overlay with animation
const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

// Enhanced modal content with animation
const PopupContent = styled.div`
  background: linear-gradient(135deg, #2c2c54, #232350);
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 550px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  transform: translateY(20px);
  animation: slideUp 0.3s forwards;

  @keyframes slideUp {
    to {
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
    width: 95%;
  }
`;

// Modal header with better spacing
const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 15px;
`;

// Modal title with better styling
const PopupTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #b3b3ff;
`;

// Close button with improved styling
const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
    transform: rotate(90deg);
    color: #ff6b6b;
  }
`;

// Scrollable music list with custom scrollbar
const PopupMusicList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(179, 179, 255, 0.5);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(179, 179, 255, 0.8);
  }
`;

// Modal music item with improved styling
const PopupMusicItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(61, 61, 61, 0.4);
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid transparent;

  &:hover {
    background: rgba(77, 77, 77, 0.6);
    transform: translateX(5px);
    border-left-color: #b3b3ff;
  }
`;

// Add button with improved styling
const AddButton = styled.button`
  background: linear-gradient(45deg, #4caf50, #2e7d32);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: linear-gradient(45deg, #2e7d32, #1b5e20);
    transform: scale(1.05);
  }
`;

// Empty state component
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: rgba(44, 44, 84, 0.3);
  border-radius: 12px;
  margin: 30px 0;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  color: #b3b3ff;
`;

const EmptyStateText = styled.p`
  font-size: 18px;
  color: #ccccff;
  margin: 0 0 20px 0;
`;

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [musicas, setMusicas] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [allMusicas, setAllMusicas] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableSongs, setAvailableSongs] = useState([]); // New state for available songs
  const audioRef = useRef(new Audio());
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const fetchPlaylist = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:3001/playlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar a playlist");
      const data = await response.json();
      setPlaylist(data.playlist);
      setMusicas(
        data.musicas.map((song) => ({
          ...song,
          url: `http://127.0.0.1:3001/musicas/${song.ficheiro}`,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemovePlaylist = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta playlist?")) {
      try {
        const response = await fetch(`http://127.0.0.1:3001/playlist/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao remover a playlist");

        navigate("/");
      } catch (error) {
        console.error("Erro ao remover a playlist:", error);
      }
    }
  };

  const fetchAllMusicas = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3001/musicas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar músicas");
      const data = await response.json();
      setAllMusicas(data);
    } catch (error) {
      console.error("Erro ao buscar músicas:", error);
    }
  };

  useEffect(() => {
    fetchPlaylist();
    fetchAllMusicas();
  }, [id, token]);

  // Update availableSongs whenever allMusicas or musicas changes
  useEffect(() => {
    const filteredSongs = allMusicas.filter(
      (song) =>
        !musicas.some((m) => m._id === song._id) && song.status === "aprovado"
    );
    setAvailableSongs(filteredSongs);
  }, [allMusicas, musicas]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("play", () => setIsPlaying(true));
      audio.removeEventListener("pause", () => setIsPlaying(false));
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const handlePlayPause = (song) => {
    if (currentTrack && currentTrack.ficheiro === song.ficheiro) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      if (currentTrack) {
        audioRef.current.pause();
      }
      setCurrentTrack(song);
      audioRef.current.src = song.url;
      audioRef.current.play();
    }
  };

  const handleRemoveFromPlaylist = async (songId, event) => {
    event.stopPropagation(); // Prevent triggering the parent onClick

    try {
      const response = await fetch(
        `http://127.0.0.1:3001/playlist/${id}/remove-musica/${songId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erro ao remover música da playlist");

      // If the current track is removed, stop playing
      if (currentTrack && currentTrack._id === songId) {
        audioRef.current.pause();
        setCurrentTrack(null);
      }

      await fetchPlaylist();
    } catch (error) {
      console.error("Erro ao remover música:", error);
    }
  };

  const handleAddToPlaylist = async (musicaId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/playlist/${id}/add-musica/${musicaId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erro ao adicionar música à playlist");

      await fetchPlaylist();
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar música:", error);
    }
  };

  return (
    <MainPage>
      <Navbar2 />
      <PlaylistContainer>
        <PlaylistHeader>
          {playlist?.imagem ? (
            <PlaylistImage
              src={`http://127.0.0.1:3001/imagens/${playlist.imagem}`}
              alt={playlist?.nome || "Playlist"}
            />
          ) : (
            <PlaylistImage
              src="https://via.placeholder.com/180?text=Playlist"
              alt="Playlist Default"
            />
          )}

          <PlaylistInfo>
            <PlaylistTitle>{playlist?.nome || "Playlist"}</PlaylistTitle>
            <p>{musicas.length} músicas</p>

            <ButtonContainer>
              <AddMusicButton onClick={() => setIsPopupOpen(true)}>
                <FaPlus /> Adicionar Músicas
              </AddMusicButton>
              <RemovePlaylistButton onClick={handleRemovePlaylist}>
                <FaTrash /> Excluir Playlist
              </RemovePlaylistButton>
            </ButtonContainer>
          </PlaylistInfo>
        </PlaylistHeader>

        <MusicList>
          {musicas.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <FaMusic />
              </EmptyStateIcon>
              <EmptyStateText>Não há músicas nesta playlist.</EmptyStateText>
              <AddMusicButton onClick={() => setIsPopupOpen(true)}>
                <FaPlus /> Adicionar Músicas
              </AddMusicButton>
            </EmptyState>
          ) : (
            musicas.map((song) => (
              <MusicItem key={song._id} onClick={() => handlePlayPause(song)}>
                <MusicDetails>
                  <MusicName>{song.nome}</MusicName>
                  <MusicArtist>{song.artista}</MusicArtist>
                </MusicDetails>
                <ActionButtons>
                  <PlayButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause(song);
                    }}
                  >
                    {currentTrack?.ficheiro === song.ficheiro && isPlaying ? (
                      <FaPause />
                    ) : (
                      <FaPlay />
                    )}
                  </PlayButton>
                  <RemoveButton
                    onClick={(e) => handleRemoveFromPlaylist(song._id, e)}
                    title="Remover da playlist"
                  >
                    <FaTimes />
                  </RemoveButton>
                </ActionButtons>
              </MusicItem>
            ))
          )}
        </MusicList>
      </PlaylistContainer>

      {isPopupOpen && (
        <PopupOverlay onClick={() => setIsPopupOpen(false)}>
          <PopupContent onClick={(e) => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>Adicionar Música à Playlist</PopupTitle>
              <CloseButton onClick={() => setIsPopupOpen(false)}>
                <FaTimes />
              </CloseButton>
            </PopupHeader>

            {availableSongs.length === 0 ? (
              <EmptyState>
                <EmptyStateText>
                  Não há mais músicas disponíveis para adicionar.
                </EmptyStateText>
              </EmptyState>
            ) : (
              <PopupMusicList>
                {availableSongs.map((song) => (
                  <PopupMusicItem key={song._id}>
                    <MusicDetails>
                      <MusicName>{song.nome}</MusicName>
                      <MusicArtist>{song.artista}</MusicArtist>
                    </MusicDetails>
                    <AddButton onClick={() => handleAddToPlaylist(song._id)}>
                      <FaPlus /> Adicionar
                    </AddButton>
                  </PopupMusicItem>
                ))}
              </PopupMusicList>
            )}
          </PopupContent>
        </PopupOverlay>
      )}

      <MiniPlayer currentTrack={currentTrack} audioRef={audioRef} />
    </MainPage>
  );
};

export default Playlist;
