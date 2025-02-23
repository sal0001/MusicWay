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

const DownloadButton = styled.a`
  background: linear-gradient(45deg, #28a745, #218838);
  color: white;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.3s ease;
  text-align: center;

  &:hover {
    background: linear-gradient(45deg, #34d058, #1e7e34);
  }
`;

const AprovarMusicas = () => {
  const [pendingSongs, setPendingSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPendingSongs = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:3001/getMusicasPendentes"
        );
        setPendingSongs(response.data);
      } catch (error) {
        console.error("Erro ao buscar músicas pendentes:", error);
      }
    };

    fetchPendingSongs();
  }, []);

  const filteredSongs = pendingSongs.filter(
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
            placeholder="Procurar músicas pendentes..."
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
                <DownloadButton
                  href={`http://127.0.0.1:3001/musicas/${song.ficheiro}`}
                  download
                >
                  ouvir
                </DownloadButton>
              </MusicItem>
            ))}
          </MusicList>
        </ContentContainer>
      </PageContainer>
    </div>
  );
};

export default AprovarMusicas;
