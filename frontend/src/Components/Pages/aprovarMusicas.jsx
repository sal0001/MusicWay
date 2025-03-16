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
  padding: 30px;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #2a2a4e);
  width: 100%;
  color: #e0e0e0;
  overflow-x: hidden;
  font-family: "Poppins", sans-serif;

  @media (min-width: 768px) {
    padding: 50px;
  }
`;

const ContentContainer = styled.div`
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  max-width: 1280px;
  align-items: center;
`;

const Title = styled.h2`
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2.5rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #00d4ff, #ff4081);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 700px;
  margin-bottom: 30px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 14px 20px 14px 50px;
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(40, 40, 60, 0.7);
  color: #ffffff;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.4s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);

  &:focus {
    background: rgba(50, 50, 70, 0.9);
    box-shadow: 0 6px 20px rgba(0, 180, 255, 0.3);
    border-color: #00b4ff;
    transform: scale(1.02);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
  }
`;

const SearchIcon = styled.i`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #00b4ff;
  font-size: 1.2rem;
  transition: color 0.3s ease;
`;

const MusicList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

const MusicItem = styled.div`
  background: linear-gradient(
    145deg,
    rgba(40, 40, 70, 0.9),
    rgba(30, 30, 60, 0.9)
  );
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 180, 255, 0.1);
  backdrop-filter: blur(12px);

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 180, 255, 0.2);
    border-color: rgba(0, 180, 255, 0.4);
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const SongInfo = styled.div`
  margin-bottom: 15px;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const SongTitle = styled.h5`
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
  font-size: 1.25rem;
  transition: color 0.3s ease;

  ${MusicItem}:hover & {
    color: #00d4ff;
  }
`;

const ArtistName = styled.p`
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 0;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DownloadButton = styled(Button)`
  background: linear-gradient(45deg, #6b48ff, #00ddeb);

  &:hover {
    background: linear-gradient(45deg, #7e5bff, #33e4ff);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 221, 235, 0.4);
  }
`;

const ApproveButton = styled(Button)`
  background: linear-gradient(45deg, #28a745, #1f7a38);

  &:hover {
    background: linear-gradient(45deg, #34c759, #2a9946);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
  }
`;

const RejectButton = styled(Button)`
  background: linear-gradient(45deg, #ff3d57, #d92c43);

  &:hover {
    background: linear-gradient(45deg, #ff576b, #e6455a);
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(255, 61, 87, 0.4);
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.2rem;
  width: 100%;
  background: rgba(40, 40, 60, 0.5);
  border-radius: 15px;
  backdrop-filter: blur(10px);
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: #00d4ff;
  animation: spin 0.8s ease-in-out infinite;
  margin-bottom: 25px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
  width: 100%;
  color: rgba(255, 255, 255, 0.9);
`;

const Toast = styled.div`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: ${(props) =>
    props.type === "success"
      ? "linear-gradient(45deg, #28a745, #34c759)"
      : "linear-gradient(45deg, #ff3d57, #e6455a)"};
  color: #ffffff;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.4s ease;
  backdrop-filter: blur(8px);
  transform: ${(props) => (props.show ? "translateY(0)" : "translateY(120px)")};
  opacity: ${(props) => (props.show ? "1" : "0")};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;

  &:before {
    content: ${(props) => (props.type === "success" ? '"✔"' : '"✖"')};
    font-size: 1.2rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: linear-gradient(
    145deg,
    rgba(40, 40, 70, 0.9),
    rgba(30, 30, 60, 0.9)
  );
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  color: #ffffff;
  position: relative;
  backdrop-filter: blur(12px);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #00d4ff;
  }
`;

const AudioPlayer = styled.audio`
  width: 100%;
  margin-top: 20px;
  &::-webkit-media-controls-panel {
    background: linear-gradient(45deg, #6b48ff, #00ddeb);
  }
`;

const ModalTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 20px;
  text-align: center;
  background: linear-gradient(90deg, #00d4ff, #ff4081);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AprovarMusicas = () => {
  const [pendingSongs, setPendingSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const fetchPendingSongs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://127.0.0.1:3001/getMusicasPendentes"
        );
        setPendingSongs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar músicas pendentes:", error);
        setLoading(false);
        showToast("Erro ao carregar músicas pendentes", "error");
      }
    };

    fetchPendingSongs();
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://127.0.0.1:3001/aprovarMusica/${id}`);
      setPendingSongs(pendingSongs.filter((song) => song._id !== id));
      showToast("Música aprovada com sucesso", "success");
      setSelectedSong(null); // Close modal if open song is approved
    } catch (error) {
      console.error("Erro ao aprovar música:", error);
      showToast("Erro ao aprovar música", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:3001/rejeitarMusica/${id}`);
      setPendingSongs(pendingSongs.filter((song) => song._id !== id));
      showToast("Música rejeitada com sucesso", "success");
      setSelectedSong(null); // Close modal if open song is rejected
    } catch (error) {
      console.error("Erro ao rejeitar música:", error);
      showToast("Erro ao rejeitar música", "error");
    }
  };

  const handlePlaySong = (song) => {
    setSelectedSong(song);
  };

  const closeModal = () => {
    setSelectedSong(null);
  };

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
          <SearchContainer>
            <SearchIcon className="fas fa-search" />
            <SearchBar
              type="text"
              placeholder="Procurar por nome ou artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
              <p>Carregando músicas pendentes...</p>
            </LoadingContainer>
          ) : filteredSongs.length > 0 ? (
            <MusicList>
              {filteredSongs.map((song) => (
                <MusicItem key={song._id}>
                  <SongInfo>
                    <SongTitle>{song.nome}</SongTitle>
                    <ArtistName>
                      <i className="fas fa-user" /> {song.artista}
                    </ArtistName>
                  </SongInfo>
                  <ButtonGroup>
                    <DownloadButton onClick={() => handlePlaySong(song)}>
                      <i className="fas fa-headphones" /> Ouvir
                    </DownloadButton>
                    <ApproveButton onClick={() => handleApprove(song._id)}>
                      <i className="fas fa-check" /> Aprovar
                    </ApproveButton>
                    <RejectButton onClick={() => handleReject(song._id)}>
                      <i className="fas fa-times" /> Rejeitar
                    </RejectButton>
                  </ButtonGroup>
                </MusicItem>
              ))}
            </MusicList>
          ) : (
            <EmptyMessage>
              {searchTerm ? (
                <>
                  <i
                    className="fas fa-search mb-3"
                    style={{ fontSize: "1.5rem" }}
                  />
                  <p>Nenhuma música encontrada com "{searchTerm}"</p>
                </>
              ) : (
                <>
                  <i
                    className="fas fa-music mb-3"
                    style={{ fontSize: "1.5rem" }}
                  />
                  <p>Não há músicas pendentes para aprovação</p>
                </>
              )}
            </EmptyMessage>
          )}
        </ContentContainer>
      </PageContainer>

      {selectedSong && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeModal}>
              <i className="fas fa-times" />
            </CloseButton>
            <ModalTitle>{selectedSong.nome}</ModalTitle>
            <ArtistName
              style={{ justifyContent: "center", marginBottom: "20px" }}
            >
              <i className="fas fa-user" /> {selectedSong.artista}
            </ArtistName>
            <AudioPlayer
              controls
              autoPlay
              src={`http://127.0.0.1:3001/musicas/${selectedSong.ficheiro}`}
            >
              Your browser does not support the audio element.
            </AudioPlayer>
          </ModalContent>
        </ModalOverlay>
      )}

      <Toast show={toast.show} type={toast.type}>
        {toast.message}
      </Toast>
    </div>
  );
};

export default AprovarMusicas;
