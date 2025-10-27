import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar3 from "../navbar/Navbar3/index";
import styled from "styled-components";
import axios from "axios";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #2a2a4e);
  color: #e0e0e0;
  font-family: "Poppins", sans-serif;
  overflow-x: hidden;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 3rem 1.5rem;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  margin-top: 100px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 700px;
  margin: 0 auto 2.5rem auto;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 16px 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(40, 50, 70, 0.7);
  color: #ffffff;
  font-size: 1.1rem;
  transition: all 0.4s ease;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
  }

  &:focus {
    border-color: #00b4ff;
    background: rgba(50, 60, 80, 0.9);
    box-shadow: 0 6px 20px rgba(0, 180, 255, 0.3);
    transform: scale(1.02);
    outline: none;
  }
`;

const MusicList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MusicItem = styled.div`
  background: linear-gradient(
    135deg,
    rgba(40, 50, 70, 0.9),
    rgba(30, 40, 60, 0.9)
  );
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid rgba(0, 180, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-5px) scale(1.02);
    background: linear-gradient(
      135deg,
      rgba(50, 60, 80, 0.9),
      rgba(40, 50, 70, 0.9)
    );
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 180, 255, 0.2);
    border-color: rgba(0, 180, 255, 0.3);
  }
`;

const MusicInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MusicName = styled.h5`
  margin: 0;
  font-size: 1.25rem;
  color: #ffffff;
  font-weight: 600;
  transition: color 0.3s ease;

  ${MusicItem}:hover & {
    color: #00d4ff;
  }
`;

const MusicArtist = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    color: #00b4ff;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #ff4757, #d92c43);
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ff576b, #e6455a);
    transform: scale(1.15) rotate(5deg);
    box-shadow: 0 6px 18px rgba(255, 71, 87, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  i {
    font-size: 1.1rem;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.2rem;
  width: 100%;
  background: rgba(40, 50, 70, 0.5);
  border-radius: 15px;
  backdrop-filter: blur(10px);
`;

const Musicas = () => {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3001/musicas");
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };
    fetchSongs();
  }, []);

  const handleRemoveSong = async (songId) => {
    try {
      await axios.delete(`http://127.0.0.1:3001/musicas/${songId}`);
      setSongs(songs.filter((song) => song._id !== songId));
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <Navbar3 />
      <ContentContainer>
        <SearchContainer>
          <SearchBar
            type="text"
            placeholder="Procurar músicas por nome ou artista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        {filteredSongs.length > 0 ? (
          <MusicList>
            {filteredSongs.map((song) => (
              <MusicItem key={song._id}>
                <MusicInfo>
                  <MusicName>{song.nome}</MusicName>
                  <MusicArtist>
                    <i className="fas fa-user" /> {song.artista}
                  </MusicArtist>
                </MusicInfo>
                <ActionButton onClick={() => handleRemoveSong(song._id)}>
                  <i className="fas fa-trash-alt" />
                </ActionButton>
              </MusicItem>
            ))}
          </MusicList>
        ) : (
          <EmptyMessage>
            <i className="fas fa-music mb-3" style={{ fontSize: "1.5rem" }} />
            <p>
              {searchTerm
                ? `Nenhuma música encontrada com "${searchTerm}"`
                : "Não há músicas para exibir"}
            </p>
          </EmptyMessage>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default Musicas;
