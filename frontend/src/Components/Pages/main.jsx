import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar2 from '../navbar/navbar2';
import styled from 'styled-components';
import MiniPlayer from './MiniPlayer';

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
`;

const SidebarTitle = styled.h2`
    font-size: 1.5em;
    margin-bottom: 30px;
    color: #fff;
`;


const MusicListContainer = styled.div`
    margin-left: 400px;
    padding: 20px;
    flex: 1;
    margin-top: 60px;
    width: 100%;
`;

const SearchContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
`;

const SearchInput = styled.input`
    margin-top: 20px;
    padding: 10px 20px;
    border-radius: 25px;
    background-color: white;
    color: black;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ccc;

    &::placeholder {
        color: black;
    }

    &:focus {
        outline: none;
        border-color: #007bff;
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
        } catch (error) {
            console.error('Error fetching songs:', error.message);
        }
    };

    useEffect(() => {
        fetchSongs();
    }, []);

    const handlePlayPause = (song) => {
        if (currentTrack && currentTrack.ficheiro === song.ficheiro) {
            if (audioRef.current) {
                if (audioRef.current.paused) {
                    
                    audioRef.current.play().catch(error => {
                        console.error("Erro ao tentar retomar a música:", error);
                    });
                } else {
                   
                    audioRef.current.pause();
                }
            }
        } else {
            
            setCurrentTrack(song);
            if (audioRef.current) {
                audioRef.current.src = `http://127.0.0.1:3001/musicas/${song.ficheiro}`;
                audioRef.current.load(); 
                audioRef.current.play().catch(error => {
                    console.error("Erro ao tentar tocar a nova música:", error);
                });
            }
        }
    };

    const filteredSongs = publishedSongs.filter(song => 
        song.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
        song.artista.toLowerCase().includes(searchQuery.toLowerCase())
    );

   

    return (
        <div>
            <Navbar2 />
            <div style={{ display: 'flex' }}>
                <SidebarContainer>
                    <SidebarTitle></SidebarTitle>
                    
                </SidebarContainer>

                <MusicListContainer>
                    <SearchContainer>
                        <SearchInput 
                            type="text" 
                            placeholder="Pesquisa por musicas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                    </SearchContainer>
                    {filteredSongs.map(song => (
                        <MusicItem key={song._id} onClick={() => handlePlayPause(song)}>
                            <MusicName>{song.nome}</MusicName>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <MusicArtist>{song.artista}</MusicArtist>
                                <PlayButton onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handlePlayPause(song); 
                                }}>
                                    <i className={audioRef.current?.paused ? "fas fa-play" : "fas fa-play"}></i>
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
