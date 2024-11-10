import React, { useState, useEffect } from 'react';
import Navbar3 from '../navbar/navbar3';

const AddPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publishedSongs, setPublishedSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/musicas');
        const data = await response.json();
        setPublishedSongs(data);
      } catch (error) {
        console.error('Erro ao buscar músicas:', error);
      }
    };

    fetchSongs();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setPlaylistName('');
    setSelectedSongs([]);
  };

  const handleSongSelect = (song) => {
    if (selectedSongs.includes(song)) {
      setSelectedSongs(selectedSongs.filter((s) => s !== song));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleAddPlaylistToServer = async () => {
    if (selectedSongs.length > 0 && playlistName) {
      try {
        const userEmail = localStorage.getItem('email');
        const userResponse = await fetch(`http://127.0.0.1:3001/buscarUtilizadorPorEmail?email=${userEmail}`);

        if (!userResponse.ok) {
          throw new Error('Erro ao buscar utilizador');
        }

        const userData = await userResponse.json();
        const nome = userData.nome;

        const playlistResponse = await fetch('http://127.0.0.1:3001/CriarPlaylists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: playlistName,
            utilizador: nome,
            musicas: selectedSongs.map(song => song._id),
          }),
        });

        if (!playlistResponse.ok) {
          throw new Error('Erro ao criar a playlist');
        }

        const playlistData = await playlistResponse.json();
        console.log('Playlist criada com sucesso:', playlistData);

        setPlaylists([...playlists, { name: playlistName, songs: selectedSongs.map(song => song.nome) }]);
        setIsModalOpen(false);
        setSelectedSongs([]);

      } catch (error) {
        console.error('Erro ao criar playlist:', error);
      }
    }
  };


  const filteredSongs = publishedSongs.filter(song =>
    song.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar3 />
      <br />
      <br />
      <br />
      <br />

      <div style={styles.container}>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Nome da Playlist"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            style={styles.playlistInput}
          />
          <input
            type="text"
            placeholder="Procurar Músicas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button onClick={handleAddPlaylistToServer} style={styles.addSongsButton}>
            Criar Playlist
          </button>
        </div>
        <ul style={styles.songList}>
          {(searchQuery ? filteredSongs : publishedSongs).map((song) => (
            <li
              key={song._id}
              style={{
                ...styles.songItem,
                backgroundColor: selectedSongs.includes(song) ? '#d3f4d3' : '#f0f0f0',
              }}
              onClick={() => handleSongSelect(song)}
            >
              {song.nome} - {song.artista}
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2>Selecione Músicas</h2>
            <ul style={styles.songList}>
              {(searchQuery ? filteredSongs : publishedSongs).map((song) => (
                <li
                  key={song._id}
                  style={{
                    ...styles.songItem,
                    backgroundColor: selectedSongs.includes(song) ? '#d3f4d3' : '#f0f0f0',
                  }}
                  onClick={() => handleSongSelect(song)}
                >
                  {song.nome} - {song.artista}
                </li>
              ))}
            </ul>
            <button onClick={handleAddPlaylistToServer} style={styles.addSongsButton}>
              Criar Playlist
            </button>
            <button onClick={toggleModal} style={styles.closeModalButton}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  playlistInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  searchInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  songList: {
    listStyle: 'none',
    padding: '0',
    marginBottom: '20px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  songItem: {
    padding: '10px',
    cursor: 'pointer',
    margin: '5px 0',
    borderRadius: '4px',
  },
  addSongsButton: {
    backgroundColor: 'grey',
    border: 'none',
    color: 'white',
    padding: '10px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  closeModalButton: {
    backgroundColor: '#dc3545',
    border: 'none',
    color: 'white',
    padding: '10px',
    cursor: 'pointer',
  },
};

export default AddPlaylists;
