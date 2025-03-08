import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar2 from "../navbar/navbar2";
import MiniPlayer from "./MiniPlayer";
import styled from "styled-components";
import {
  FaMusic,
  FaInfoCircle,
  FaTimes,
  FaPlus,
  FaTrash,
  FaPlay,
  FaPause,
} from "react-icons/fa";

const MainPage = styled.div`
  background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
  width: 100%;
  min-height: 100vh;
  color: #e2e8f0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inter", sans-serif;
`;

const PlaylistContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 100px auto 0;
  padding: 40px;
  border-radius: 24px;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);

  @media (max-width: 1024px) {
    width: 92%;
    padding: 30px;
    margin-top: 80px;
  }

  @media (max-width: 768px) {
    width: 94%;
    padding: 20px;
    margin-top: 70px;
  }

  @media (max-width: 480px) {
    width: 96%;
    padding: 15px;
    margin-top: 60px;
  }
`;

const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    gap: 15px;
    margin-bottom: 20px;
  }
`;

const PlaylistImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 16px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-8px) scale(1.04);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 1024px) {
    width: 180px;
    height: 180px;
  }

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }
`;

const PlaylistInfo = styled.div`
  flex: 1;
`;

const PlaylistTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(90deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;

  @media (max-width: 1024px) {
    font-size: 2.4rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 25px;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-top: 15px;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-4px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.5);
  }

  @media (max-width: 1024px) {
    padding: 12px 24px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 14px;
    gap: 8px;
  }
`;

const AddMusicButton = styled(ActionButton)`
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;

  &:hover {
    background: linear-gradient(45deg, #16a34a, #15803d);
    box-shadow: 0 8px 24px rgba(22, 197, 94, 0.4);
  }
`;

const RemovePlaylistButton = styled(ActionButton)`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;

  &:hover {
    background: linear-gradient(45deg, #dc2626, #b91c1c);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
  }
`;

const EditButton = styled(ActionButton)`
  background: linear-gradient(45deg, #3b82f6, #2563eb);
  color: white;

  &:hover {
    background: linear-gradient(45deg, #2563eb, #1d4ed8);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  }
`;

const MusicList = styled.div`
  margin-top: 40px;
  width: 100%;
  margin-bottom: 160px;

  @media (max-width: 768px) {
    margin-top: 30px;
    margin-bottom: 120px;
  }

  @media (max-width: 480px) {
    margin-top: 20px;
    margin-bottom: 100px;
  }
`;

const MusicItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(51, 65, 85, 0.6);
  padding: 18px 24px;
  border-radius: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border-left: 5px solid transparent;

  &:hover {
    background: rgba(71, 85, 105, 0.8);
    transform: translateX(8px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border-left-color: #a5b4fc;
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
  }

  @media (max-width: 480px) {
    padding: 12px 15px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const MusicDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const MusicName = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #f1f5f9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
  }
`;

const MusicArtist = styled.span`
  font-size: 0.875rem;
  color: #a5b4fc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-end;
    gap: 12px;
  }
`;

const PlayButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #e2e8f0;
  font-size: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(165, 180, 252, 0.2);
    transform: scale(1.15);
    color: #a5b4fc;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
    font-size: 16px;
  }
`;

const RemoveButton = styled.button`
  background: rgba(255, 107, 107, 0.1);
  border: none;
  color: #f87171;
  font-size: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
    transform: scale(1.15);
    color: #ef4444;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
    font-size: 16px;
  }
`;

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.4s ease forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const PopupContent = styled.div`
  background: linear-gradient(135deg, #1e293b, #172554);
  padding: 35px;
  border-radius: 24px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  transform: translateY(30px);
  animation: slideUp 0.4s ease forwards;

  @keyframes slideUp {
    to {
      transform: translateY(0);
    }
  }

  @media (max-width: 1024px) {
    max-width: 550px;
    padding: 30px;
  }

  @media (max-width: 768px) {
    width: 94%;
    max-width: 500px;
    padding: 25px;
  }

  @media (max-width: 480px) {
    width: 96%;
    padding: 20px;
  }
`;

const EditPopupContent = styled(PopupContent)`
  max-width: 500px;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  @media (max-width: 480px) {
    margin-bottom: 15px;
    padding-bottom: 10px;
  }
`;

const PopupTitle = styled.h3`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #a5b4fc;
  letter-spacing: -0.2px;

  @media (max-width: 768px) {
    font-size: 1.375rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #e2e8f0;
  font-size: 22px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(248, 113, 113, 0.2);
    transform: rotate(90deg);
    color: #f87171;
  }

  @media (max-width: 768px) {
    width: 38px;
    height: 38px;
    font-size: 20px;
  }

  @media (max-width: 480px) {
    width: 34px;
    height: 34px;
    font-size: 18px;
  }
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EditInput = styled.input`
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(51, 65, 85, 0.6);
  color: #e2e8f0;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #a5b4fc;
    background: rgba(51, 65, 85, 0.8);
    box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.3);
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 14px;
  }
`;

const SaveButton = styled(ActionButton)`
  background: linear-gradient(45deg, #3b82f6, #2563eb);
  color: white;

  &:hover {
    background: linear-gradient(45deg, #2563eb, #1d4ed8);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
  }
`;

const PopupMusicList = styled.div`
  max-height: 450px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(165, 180, 252, 0.6);
    border-radius: 12px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(165, 180, 252, 0.9);
  }

  @media (max-width: 768px) {
    max-height: 350px;
  }

  @media (max-width: 480px) {
    max-height: 300px;
    padding-right: 5px;
  }
`;

const PopupMusicItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(51, 65, 85, 0.5);
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  &:hover {
    background: rgba(71, 85, 105, 0.7);
    transform: translateX(6px);
    border-left-color: #a5b4fc;
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
  }

  @media (max-width: 480px) {
    padding: 12px 15px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: linear-gradient(45deg, #16a34a, #15803d);
    transform: scale(1.08);
  }

  @media (max-width: 768px) {
    padding: 8px 18px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 12px;
    width: 100%;
    justify-content: center;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 25px;
  text-align: center;
  background: rgba(51, 65, 85, 0.3);
  border-radius: 16px;
  margin: 40px 0;

  @media (max-width: 768px) {
    padding: 40px 20px;
    margin: 30px 0;
  }

  @media (max-width: 480px) {
    padding: 30px 15px;
    margin: 20px 0;
  }
`;

const EmptyStateIcon = styled.div`
  font-size: 56px;
  margin-bottom: 25px;
  color: #a5b4fc;

  @media (max-width: 768px) {
    font-size: 48px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 40px;
    margin-bottom: 15px;
  }
`;

const EmptyStateText = styled.p`
  font-size: 1.125rem;
  color: #cbd5e1;
  margin: 0 0 25px 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 15px;
  }
`;

const DeleteConfirmPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  opacity: 0;
  animation: fadeIn 0.4s ease forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const DeleteConfirmContent = styled.div`
  background: linear-gradient(135deg, #1e293b, #172554);
  padding: 30px;
  border-radius: 24px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  transform: translateY(30px);
  animation: slideUp 0.4s ease forwards;

  @keyframes slideUp {
    to {
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 25px;
    max-width: 400px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    width: 94%;
  }
`;

const DeleteMessage = styled.p`
  font-size: 1.125rem;
  color: #e2e8f0;
  margin: 0 0 30px 0;
  line-height: 1.5;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    margin-bottom: 20px;
  }
`;

const DeleteButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    flex-direction: column;
  }
`;

const ConfirmButton = styled(ActionButton)`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;

  &:hover {
    background: linear-gradient(45deg, #dc2626, #b91c1c);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CancelButton = styled(ActionButton)`
  background: linear-gradient(45deg, #64748b, #475569);
  color: white;

  &:hover {
    background: linear-gradient(45deg, #475569, #334155);
    box-shadow: 0 8px 24px rgba(100, 116, 139, 0.4);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
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
  const [availableSongs, setAvailableSongs] = useState([]);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
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
    setIsDeletePopupOpen(true);
  };

  const confirmDeletePlaylist = async () => {
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
    setIsDeletePopupOpen(false);
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

  const handleEditPlaylistName = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:3001/playlist/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: newPlaylistName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erro ao atualizar o nome da playlist"
        );
      }

      const data = await response.json();
      setPlaylist(data.playlist);
      setIsEditPopupOpen(false);
      setNewPlaylistName("");
    } catch (error) {
      console.error("Erro ao atualizar o nome:", error);
      alert(error.message); // Simple error feedback to user
    }
  };

  useEffect(() => {
    fetchPlaylist();
    fetchAllMusicas();
  }, [id, token]);

  useEffect(() => {
    const filteredSongs = allMusicas.filter(
      (song) =>
        !musicas.some((m) => m._id === song._id) && song.status === "aprovado"
    );
    setAvailableSongs(filteredSongs);
  }, [allMusicas, musicas]);

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

  const handleRemoveFromPlaylist = async (songId, event) => {
    event.stopPropagation();

    try {
      const response = await fetch(
        `http://127.0.0.1:3001/playlist/${id}/remove-musica/${songId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erro ao remover música da playlist");

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
              src="https://via.placeholder.com/200?text=Playlist"
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
                <FaTrash /> Eliminar Playlist
              </RemovePlaylistButton>
              <EditButton
                onClick={() => {
                  setNewPlaylistName(playlist?.nome || "");
                  setIsEditPopupOpen(true);
                }}
              >
                <FaInfoCircle /> Editar Nome da Playlist
              </EditButton>
            </ButtonContainer>
          </PlaylistInfo>
        </PlaylistHeader>

        <MusicList>
          {musicas.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <FaMusic />
              </EmptyStateIcon>
              <EmptyStateText>
                Nenhuma música nesta playlist ainda.
              </EmptyStateText>
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
                  Não há músicas disponíveis para adicionar.
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

      {isDeletePopupOpen && (
        <DeleteConfirmPopup onClick={() => setIsDeletePopupOpen(false)}>
          <DeleteConfirmContent onClick={(e) => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>Confirmar Eliminação</PopupTitle>
              <CloseButton onClick={() => setIsDeletePopupOpen(false)}>
                <FaTimes />
              </CloseButton>
            </PopupHeader>
            <DeleteMessage>
              Tem certeza que deseja eliminar a playlist "{playlist?.nome}"?
              Esta ação não pode ser desfeita.
            </DeleteMessage>
            <DeleteButtonContainer>
              <CancelButton onClick={() => setIsDeletePopupOpen(false)}>
                Cancelar
              </CancelButton>
              <ConfirmButton onClick={confirmDeletePlaylist}>
                <FaTrash /> Eliminar
              </ConfirmButton>
            </DeleteButtonContainer>
          </DeleteConfirmContent>
        </DeleteConfirmPopup>
      )}

      {isEditPopupOpen && (
        <PopupOverlay onClick={() => setIsEditPopupOpen(false)}>
          <EditPopupContent onClick={(e) => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>Editar Nome da Playlist</PopupTitle>
              <CloseButton onClick={() => setIsEditPopupOpen(false)}>
                <FaTimes />
              </CloseButton>
            </PopupHeader>
            <EditForm onSubmit={handleEditPlaylistName}>
              <EditInput
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Novo nome da playlist"
                required
              />
              <SaveButton type="submit">
                <FaInfoCircle /> Salvar
              </SaveButton>
            </EditForm>
          </EditPopupContent>
        </PopupOverlay>
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
    </MainPage>
  );
};

export default Playlist;
