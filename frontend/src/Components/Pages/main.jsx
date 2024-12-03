import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar2 from '../navbar/navbar2';
import styled from 'styled-components';
import MiniPlayer from './MiniPlayer';
import { FaMusic, FaAddressCard, FaInfoCircle, FaUserCircle } from 'react-icons/fa';

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

const RightSidebarContainer = styled.div`
    width: 90px;
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

const MusicListContainer = styled.div`
    margin-left: 400px;
    margin-right: 100px;
    padding: 20px;
    flex: 1;
    margin-top: 60px;
    width: 100%;
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

const Main = () => {
    const [publishedSongs, setPublishedSongs] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const audioRef = useRef(null);

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
    

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:3001/getCategorias');
            if (!response.ok) {
                throw new Error('Failed to fetch categories: ' + response.statusText);
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        }
    };

    useEffect(() => {
        fetchSongs();
        fetchCategories();

        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handlePlayPause = (song) => {
        if (currentTrack && currentTrack.ficheiro === song.ficheiro) {
           
            if (audioRef.current.paused) {
                audioRef.current.play().catch(error => {
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
                audioRef.current.play().catch(error => {
                    console.error("Erro ao tentar tocar a nova música:", error);
                });
            }
        }
    };

    const filteredSongs = publishedSongs.filter(song =>
        (song.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artista.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedCategory ? song.categoria === selectedCategory : true)
    );

    return (
        <div>
            <Navbar2 />
            <div style={{ display: 'flex' }}>
                <SidebarContainer>
                    <SidebarTitle></SidebarTitle>
                </SidebarContainer>

                <MusicListContainer>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
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
                    {filteredSongs.map(song => (
                        <MusicItem key={song._id} onClick={() => handlePlayPause(song)}>
                            <MusicName>{song.nome}</MusicName>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <MusicArtist>{song.artista}</MusicArtist>
                                <PlayButton onClick={(e) => {
    e.stopPropagation();
    handlePlayPause(song);
}}>
    <i className={
        currentTrack && currentTrack.ficheiro === song.ficheiro && !audioRef.current?.paused
            ? "fas fa-pause"
            : "fas fa-play"
    }></i>
</PlayButton>
                            </div>
                        </MusicItem>
                    ))}
                </MusicListContainer>

                {isLoggedIn ? (
    <RightSidebarContainer>
        <SidebarTitle></SidebarTitle>
        <SidebarLink href="/main/Perfil"> 
            <FaUserCircle />
        </SidebarLink>
        <SidebarLink href="/adicionarMusicas">
            <FaMusic />
        </SidebarLink>
        <SidebarLink href="">
            <FaAddressCard />
        </SidebarLink>
        <SidebarLink href="">
            <FaInfoCircle />     
        </SidebarLink>
    </RightSidebarContainer>
) : (
    <RightSidebarContainer>
       <SidebarTitle></SidebarTitle>
    </RightSidebarContainer>
)}

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
