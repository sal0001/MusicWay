import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar2 from '../navbar/navbar2';
import MiniPlayer from './MiniPlayer';
import styled from 'styled-components';
import { FaMusic, FaAddressCard, FaInfoCircle, FaUserCircle } from 'react-icons/fa';

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


    const token = localStorage.getItem('token'); 
    const isLoggedIn = !!token; 

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/playlist/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar a playlist');
                }

                const data = await response.json();
                setPlaylist(data.playlist);
                setMusicas(data.musicas);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [id, token]);

    const fetchSongs = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3001/musicas');
            if (!response.ok) {
                throw new Error('Failed to fetch songs: ' + response.statusText);
            }
            const data = await response.json();
    
            const approvedSongs = data.filter(song => song.status === 'aprovado');
    
            const songsWithUrls = approvedSongs.map(song => ({
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
    }, [id]);

    const handlePlayPause = (song) => {
        if (currentTrack && currentTrack.ficheiro === song.ficheiro) {
            // Se a música for a mesma, só pausa ou toca
            if (audioRef.current.paused) {
                audioRef.current.play().catch(error => {
                    console.error("Erro ao tentar retomar a música:", error);
                });
            } else {
                audioRef.current.pause();
            }
        } else {
            // Se for uma nova música, atualize o track e carregue a nova música
            setCurrentTrack(song);
            if (audioRef.current) {
                audioRef.current.src = song.url;
                audioRef.current.load();
                audioRef.current.play().catch(error => {
                    console.error("Erro ao tentar tocar a nova música:", error);
                });
            }
        }
    };
    
    return (
        <div>
            <Navbar2 />
            <div style={{ marginTop: '80px', padding: '20px' }}>
                <h2>{playlist?.nome || 'Playlist'}</h2>
    
                {musicas.length === 0 ? (
                    <p>Não há músicas nesta playlist.</p>
                ) : (
                    musicas.map((musica) => (
                        <MusicItem key={musica._id} onClick={() => handlePlayPause(musica)}>
                            <MusicName>{musica.nome}</MusicName>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <MusicArtist>{musica.artista}</MusicArtist>
                                <PlayButton onClick={(e) => {
                                    e.stopPropagation(); 
                                    handlePlayPause(musica);
                                }}>
                                    <i className={
                                        currentTrack && currentTrack.ficheiro === musica.ficheiro && !audioRef.current?.paused
                                            ? "fas fa-pause"
                                            : "fas fa-play"
                                    }></i>
                                </PlayButton>
                            </div>
                        </MusicItem>
                    ))
                )}
            </div>
    
            {isLoggedIn ? (
                <RightSidebarContainer>
                    <SidebarLink href="/main/Perfil">
                        <FaUserCircle style={{ marginRight: '8px' }}/>Perfil
                    </SidebarLink>
                    <SidebarLink href="/adicionarMusicas">
                        <FaMusic style={{ marginRight: '8px' }} />Publicar
                    </SidebarLink>
                    <SidebarLink href="/criarPlaylist">
                        <FaAddressCard style={{ marginRight: '8px' }} />Playlist +
                    </SidebarLink>
                </RightSidebarContainer>
            ) : (
                <RightSidebarContainer />
            )}
    
            <MiniPlayer currentTrack={currentTrack} audioRef={audioRef} />
        </div>
    );    
};

export default Playlist;
