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
} from "react-icons/fa";

const MainPage = styled.div`
  background: linear-gradient(to bottom, #1e1e2f, #252545);
  width: 100%;
  min-height: 100vh;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlaylistContainer = styled.div`
  width: 100%; // Alterado para ocupar 100% da largura
  max-width: 100%; // Aumentei o max-width para dar mais espaço
  margin-top: 120px;
  padding-left: 20px; // Adicionado padding à esquerda para alinhar o conteúdo
`;

const PlaylistImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 20px;
  object-fit: cover;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const MusicList = styled.div`
  margin-top: 20px;
  width: 100%; // Ocupa 100% da largura disponível
  margin-bottom: 200px;
  padding-left: 0; // Removido qualquer padding que possa estar centralizando o conteúdo
  padding-right: 110px;
`;

const MusicItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2c2c54;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s, background 0.3s, box-shadow 0.3s;

  &:hover {
    background: #333373;
    transform: scale(1.01);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const MusicDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MusicName = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const MusicArtist = styled.span`
  font-size: 14px;
  color: #bbb;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #ff6b6b;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #ff4d4d;
  }
`;

const AddMusicButton = styled.button`
  background: linear-gradient(45deg, green, green);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s;

  &:hover {
    background: lightgreen;
  }
`;

const RemovePlaylistButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #c05656);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.3s;

  &:hover {
    background: darkred;
  }
`;

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
`;

const PopupContent = styled.div`
  background: #2c2c54;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PopupTitle = styled.h3`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
`;

const PopupMusicList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const PopupMusicItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #3d3d3d;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #444;
  }
`;

const AddButton = styled.button`
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #ff4d4d;
  }
`;

const RightSidebarContainer = styled.div`
  width: 110px;
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

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [musicas, setMusicas] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [allMusicas, setAllMusicas] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
  };

  useEffect(() => {
    fetchPlaylist();

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

    fetchAllMusicas();
  }, [id, token]);

  const handlePlayPause = (song) => {
    if (currentTrack && currentTrack.ficheiro === song.ficheiro) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else {
      setCurrentTrack(song);
      audioRef.current.src = song.url;
      audioRef.current.play();
    }
  };

  const handleRemoveFromPlaylist = async (songId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:3001/playlist/${id}/remove-musica/${songId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Erro ao remover música da playlist");

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
        {playlist?.imagem && (
          <PlaylistImage
            src={`http://127.0.0.1:3001/imagens/${playlist.imagem}`}
            alt="Playlist"
          />
        )}
        <h2>{playlist?.nome || "Playlist"}</h2>
        <AddMusicButton
          onClick={() => setIsPopupOpen(true)}
          style={{ marginRight: "10px" }}
        >
          <FaPlus style={{ marginRight: "0" }} />
        </AddMusicButton>
        <RemovePlaylistButton onClick={handleRemovePlaylist}>
          <FaTrash style={{ marginRight: "0" }} />
        </RemovePlaylistButton>
        <MusicList>
          {musicas.length === 0 ? (
            <p>Não há músicas nesta playlist.</p>
          ) : (
            musicas.map((song) => (
              <MusicItem key={song._id}>
                <MusicDetails onClick={() => handlePlayPause(song)}>
                  <MusicName>{song.nome}</MusicName>
                  <MusicArtist>{song.artista}</MusicArtist>
                </MusicDetails>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <PlayButton onClick={() => handlePlayPause(song)}>
                    <i
                      className={
                        currentTrack?.ficheiro === song.ficheiro &&
                        !audioRef.current?.paused
                          ? "fas fa-pause"
                          : "fas fa-play"
                      }
                    ></i>
                  </PlayButton>
                  <RemoveButton
                    onClick={() => handleRemoveFromPlaylist(song._id)}
                  >
                    <FaTimes />
                  </RemoveButton>
                </div>
              </MusicItem>
            ))
          )}
        </MusicList>
      </PlaylistContainer>

      {isPopupOpen && (
        <PopupOverlay>
          <PopupContent>
            <PopupHeader>
              <PopupTitle>Adicionar Música à Playlist</PopupTitle>
              <CloseButton onClick={() => setIsPopupOpen(false)}>
                <FaTimes />
              </CloseButton>
            </PopupHeader>
            <PopupMusicList>
              {allMusicas.map((song) => (
                <PopupMusicItem key={song._id}>
                  <div>
                    <MusicName>{song.nome}</MusicName>
                    <br />
                    <MusicArtist>{song.artista}</MusicArtist>
                  </div>
                  <AddButton onClick={() => handleAddToPlaylist(song._id)}>
                    Adicionar
                  </AddButton>
                </PopupMusicItem>
              ))}
            </PopupMusicList>
          </PopupContent>
        </PopupOverlay>
      )}

      {isLoggedIn ? (
        <RightSidebarContainer>
          <br />
          <SidebarLink href="/main/Perfil">
            <FaUserCircle style={{ marginRight: "8px", fontSize: "30px" }} />
          </SidebarLink>
          <SidebarLink href="/Sobrenos">
            <FaInfoCircle style={{ marginRight: "8px", fontSize: "30px" }} />
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
      <MiniPlayer currentTrack={currentTrack} audioRef={audioRef} />
    </MainPage>
  );
};

export default Playlist;
