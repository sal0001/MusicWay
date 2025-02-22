import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar2 from "../navbar/navbar2";
import MiniPlayer from "./MiniPlayer";
import styled from "styled-components";
import {
  FaMusic,
  FaAddressCard,
  FaInfoCircle,
  FaUserCircle,
} from "react-icons/fa";

const MusicItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-radius: 8px;
  background-color: #333;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-right: 170px;

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

const MusicImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 20px;
  background-color: #555;
  margin-right: 15px;
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

const MainPage = styled.div`
  background: linear-gradient(to bottom, #d3d3d3, grey);
  width: 100%;
  height: 100vh;
  margin-top: 0;
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

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [musicas, setMusicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(new Audio());
  const [publishedSongs, setPublishedSongs] = useState([]);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3001/playlist/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar a playlist");
        }

        const data = await response.json();
        setPlaylist(data.playlist);
        setMusicas(data.musicas);

        const songsWithUrls = data.musicas.map((song) => ({
          ...song,
          url: `http://127.0.0.1:3001/musicas/${song.ficheiro}`,
        }));
        setPublishedSongs(songsWithUrls);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id, token]);

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
  };

  return (
    <MainPage>
      <div>
        <Navbar2 />
        <div style={{ marginTop: "80px", padding: "20px" }}>
          {playlist?.imagem && (
            <img
              src={playlist.imagem}
              alt="Imagem da Playlist"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "20px",
                objectFit: "cover",
                marginBottom: "20px",
              }}
            />
          )}
          <h2>{playlist?.nome || "Playlist"}</h2>
          <br />
          {publishedSongs.length === 0 ? (
            <p>Não há músicas nesta playlist.</p>
          ) : (
            publishedSongs.map((song) => (
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
            ))
          )}
        </div>
        {isLoggedIn ? (
          <RightSidebarContainer>
            <br />
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
            <SidebarLink href="/Sobrenos">
              <FaInfoCircle style={{ marginRight: "8px" }} />
              Contactar
            </SidebarLink>
          </RightSidebarContainer>
        )}
        <MiniPlayer currentTrack={currentTrack} audioRef={audioRef} />~
      </div>
    </MainPage>
  );
};

export default Playlist;
