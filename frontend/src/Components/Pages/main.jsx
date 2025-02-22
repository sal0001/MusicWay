import React, { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar2 from "../navbar/navbar2";
import styled from "styled-components";
import MiniPlayer from "./MiniPlayer";
import {
  FaMusic,
  FaAddressCard,
  FaInfoCircle,
  FaUserCircle,
} from "react-icons/fa";

const AddPlaylistButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 0.7em;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
  width: 35px;
  margin-left: auto;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #bbb;
    color: #1c1c1c;
    transform: scale(0.8);
  }
`;

const SidebarContainer = styled.div`
  width: 400px;
  height: 100vh;
  background-color: #1c1c1c;
  color: white;
  padding: 20px;
  position: fixed;
  top: 70px;
  left: 0;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #444; /* Cor de fundo */
  padding: 10px 20px; /* Espaçamento interno */
  border-radius: 12px; /* Bordas arredondadas */
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

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px auto;
  padding: 5px 10px;
  background-color: #333;
  border-radius: 25px;
  width: 100%;
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
const PageContainer = styled.div`
  background: linear-gradient(to bottom, #d3d3d3, grey);
  min-height: 100vh;
`;

const Main = () => {
  const [publishedSongs, setPublishedSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const audioRef = useRef(null);
  const [playlists, setPlaylists] = useState([]);

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
  }, []);

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

  const filteredSongs = publishedSongs.filter(
    (song) =>
      (song.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artista.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory ? song.categoria === selectedCategory : true)
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
                  <AddPlaylistButton
                    onClick={() => (window.location.href = "/criarPlaylist")}
                  >
                    <FaPlus />
                  </AddPlaylistButton>
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
                <p>Registe-se ou faça login para ver as playlists</p>
              </div>
            )}
          </SidebarContainer>
          <MusicListContainer>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SearchContainer>
                <SearchIcon className="fas fa-search" />
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
        </div>
      </PageContainer>

      <MiniPlayer
        currentTrack={currentTrack}
        audioRef={audioRef}
        onPlayPause={handlePlayPause}
        onTrackEnd={() => setCurrentTrack(null)}
      />
      <audio ref={audioRef} onEnded={() => setCurrentTrack(null)} />
    </div>
  );
};

export default Main;
