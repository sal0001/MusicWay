import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './main.css';
import Navbar2 from '../navbar/navbar2';
import styled from 'styled-components';
import MiniPlayer from './MiniPlayer'; 

const SidebarContainer = styled.div`
    width: 250px;
    height: calc(100vh - 60px);
    background-color: #1c1c1c;
    color: white;
    padding: 20px;
    position: fixed;
    top: 60px;
    left: 0;
    overflow-y: auto;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
`;

const SidebarTitle = styled.h2`
    font-size: 1.5em;
    margin-bottom: 20px;
`;

const CreatePlaylistButton = styled.button`
    background-color: grey; /* Cor de fundo do botão */
    color: white; /* Texto branco */
    border: none; /* Sem borda */
    border-radius: 50%; /* Bordas arredondadas para formato circular */
    width: 40px; /* Largura do botão */
    height: 40px; /* Altura do botão */
    font-size: 24px; /* Tamanho da fonte */
    display: flex; /* Flex para centralizar o ícone */
    align-items: center; /* Centralizar verticalmente */
    justify-content: center; /* Centralizar horizontalmente */
    cursor: pointer; /* Mudar o cursor ao passar por cima */
    margin-top: 20px; /* Margem superior */
    transition: background-color 0.3s; /* Transição suave ao passar o mouse */

    &:hover {
        background-color: black; /* Cor de fundo ao passar o mouse */
    }
`;

const MusicListContainer = styled.div`
    margin-left: 270px; /* Espaçamento da sidebar */
    padding: 20px;
`;

const SearchContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    margin-right: 80em;
`;

const SearchInput = styled.input`

    padding: 10px 15px;
    border-radius: 20px; /* Bordas arredondadas */
    border: 1px solid #444; /* Bordas de um tom escuro */
    background-color: #2e2e2e; /* Fundo escuro */
    color: #ffffff; /* Texto branco */
    font-size: 16px; /* Tamanho de fonte */
    transition: border-color 0.3s, box-shadow 0.3s; /* Transição suave */
    
    &:focus {
        outline: none; /* Remove o contorno padrão */
        border-color: #007bff; /* Cor da borda ao focar */
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Sombra ao focar */
    }

    &::placeholder {
        color: #bbb; /* Cor do texto do placeholder */
    }
`;

const MusicItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-radius: 5px;
    background-color: #282828;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #3b3b3b;
    }
`;

const MusicName = styled.span`
    font-weight: bold;
    color: #fff;
`;

const MusicArtist = styled.span`
    color: #bbb;
`;

const PlayButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    color: white;
    font-size: 20px;
    margin-left: 10px;
    transition: color 0.3s;

    &:hover {
        color: #ccc; /* Slightly lighter color on hover for contrast */
    }
`;

const Main = () => {
    const [publishedSongs, setPublishedSongs] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const audioRef = useRef(null);

    const fetchSongs = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3001/musicas');
            if (!response.ok) {
                throw new Error('Failed to fetch songs: ' + response.statusText);
            }
            const data = await response.json();
            const songsWithUrls = data.map(song => ({
                ...song,
                url: `http://127.0.0.1:3001/musicas/${song.ficheiro}` 
            }));
            setPublishedSongs(songsWithUrls);
            console.log("Loaded songs:", songsWithUrls);
        } catch (error) {
            console.error('Error fetching songs:', error.message);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const handleMusicSelect = (song) => {
        console.log("Selected song:", song);

        if (currentTrack && currentTrack.ficheiro === song.ficheiro) {
            console.log("Toggling play/pause");
            if (audioRef.current) {
                if (audioRef.current.paused) {
                    console.log("Playing audio");
                    audioRef.current.play().catch(error => {
                        console.error("Error attempting to play the music:", error);
                    });
                } else {
                    console.log("Pausing audio");
                    audioRef.current.pause();
                }
            }
        } else {
            setCurrentTrack(song);
            if (audioRef.current) {
                audioRef.current.src = `http://127.0.0.1:3001/musicas/${song.ficheiro}`;
                audioRef.current.load();
                console.log("Playing new track:", audioRef.current.src);
                audioRef.current.play().catch(error => {
                    console.error("Error attempting to play the new music:", error);
                });
            }
        }
    };

    const filteredSongs = publishedSongs.filter(song => 
        song.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
        song.artista.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (audioRef.current.paused) {
                console.log("Playing audio");
                audioRef.current.play().catch(error => {
                    console.error("Error playing audio:", error);
                });
            } else {
                console.log("Pausing audio");
                audioRef.current.pause();
            }
        }
    };
    const handleCreatePlaylist = () => {
        const playlistName = prompt("Enter the name of the new playlist:");
        if (playlistName) {
            console.log(`Playlist created: ${playlistName}`);
            
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <SidebarContainer>
                <SidebarTitle>Playlists</SidebarTitle>
                
                <CreatePlaylistButton onClick={handleCreatePlaylist}>
                    <i className="fas fa-plus"></i>
                </CreatePlaylistButton>
            </SidebarContainer>

            <div style={{ marginLeft: '0', padding: '20px', flex: 1, marginTop: '40px' }}>
                <Navbar2 />
                <MusicListContainer>
                    <SearchContainer>
                        <SearchInput 
                            type="text" 
                            placeholder="Search for songs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </SearchContainer>
                    {filteredSongs.map(song => (
                        <MusicItem key={song._id} onClick={() => handleMusicSelect(song)}>
                            <MusicName>{song.nome}</MusicName>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <MusicArtist>{song.artista}</MusicArtist>
                                <PlayButton onClick={(e) => { e.stopPropagation(); handleMusicSelect(song); }}>
                                    <i className={currentTrack?.ficheiro === song.ficheiro ? "fas fa-pause" : "fas fa-play"}></i>
                                </PlayButton>
                            </div>
                        </MusicItem>
                    ))}
                </MusicListContainer>
            </div>

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
