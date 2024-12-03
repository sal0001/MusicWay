import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar3 from '../navbar/navbar3';
import styled from 'styled-components';
import axios from 'axios';

const MusicListContainer = styled.div`
    margin-top: 100px;
    padding: 40px;
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;

const MusicList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin-top: 40px;
`;

const MusicListItem = styled.li`
    background-color: #ffffff;
    margin: 15px 0;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }
`;

const RemoveButton = styled.button`
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #c82333;
    }
`;

const SearchBar = styled.input`
    width: 100%;
    padding: 15px;
    border-radius: 30px;
    border: 1px solid #ddd;
    margin-bottom: 30px;
    font-size: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    outline: none;
    transition: box-shadow 0.2s ease;

    &:focus {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
`;

const Musicas = () => {
    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/musicas');
                setSongs(response.data);
            } catch (err) {
                setError('Erro ao buscar as músicas.');
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, []);

    const handleRemoveSong = async (songId) => {
        try {
            console.log(`Removendo música com ID: ${songId}`);
            
            await axios.delete(`http://127.0.0.1:3001/musicas/${songId}`);
            
            setSongs(songs.filter(song => song._id !== songId));
            
            console.log(`Música com ID ${songId} removida.`);
        } catch (err) {
            console.error('Erro ao remover a música:', err);
            setError('Erro ao remover a música.');
        }
    };

    const filteredSongs = songs.filter(song =>
        song.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artista.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Navbar3 />
            <MusicListContainer>
                <SearchBar
                    type="text"
                    placeholder="Procurar músicas por nome ou artista..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                {loading && <p>Carregando...</p>}
                {error && <p className="text-danger">{error}</p>}
                <MusicList>
                    {filteredSongs.map(song => (
                        <MusicListItem key={song._id}>
                            <div>
                                <h5>{song.nome}</h5>
                                <p>Artista: {song.artista}</p>
                            </div>
                            <RemoveButton onClick={() => handleRemoveSong(song._id)}>
                                <i className="fas fa-trash-alt"></i>
                            </RemoveButton>
                        </MusicListItem>
                    ))}
                </MusicList>
            </MusicListContainer>
        </div>
    );
};

export default Musicas;
