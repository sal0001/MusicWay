import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar3 from "../navbar/navbar3";
import styled from "styled-components";
import axios from "axios";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  min-height: 100vh;
  background: linear-gradient(to bottom, #1e1e2f, #252545);
  width: 100vw;
  overflow-x: hidden;
  color: white;
`;

const ContentContainer = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  align-items: center;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: #3d3d3d;
  color: #ffffff;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background-color: #4a4a4a;
    box-shadow: 0px 0px 8px rgba(255, 255, 255, 0.2);
  }
`;

const MusicList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
`;

const MusicItem = styled.div`
  background: linear-gradient(to bottom, #3a3a5a, #2c2c54);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  }
`;

const RemoveButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #c05656);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #ff4d4d, #a83a3a);
  }
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
        console.error("Erro ao buscar as músicas:", error);
      }
    };

    fetchSongs();
  }, []);

  const handleRemoveSong = async (songId) => {
    try {
      await axios.delete(`http://127.0.0.1:3001/musicas/${songId}`);
      setSongs(songs.filter((song) => song._id !== songId));
    } catch (error) {
      console.error("Erro ao remover a música:", error);
    }
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar3 />
      <PageContainer>
        <ContentContainer>
          <SearchBar
            type="text"
            placeholder="Procurar músicas por nome ou artista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MusicList>
            {filteredSongs.map((song) => (
              <MusicItem key={song._id}>
                <div>
                  <h5>{song.nome}</h5>
                  <p>Artista: {song.artista}</p>
                </div>
                <RemoveButton onClick={() => handleRemoveSong(song._id)}>
                  <i className="fas fa-trash-alt"></i>
                </RemoveButton>
              </MusicItem>
            ))}
          </MusicList>
        </ContentContainer>
      </PageContainer>
    </div>
  );
};

export default Musicas;
