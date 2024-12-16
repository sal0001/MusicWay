import React, { useState, useEffect, useRef } from 'react';
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

const ApproveButton = styled.button`
    background-color: #28a745;
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
    width: 120px;  /* Definindo um tamanho fixo para o botão */

    &:hover {
        background-color: #218838;
    }
`;

const RejectButton = styled.button`
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
    width: 120px;  /* Definindo um tamanho fixo para o botão */

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

const AudioPlayer = styled.audio`
    width: 500%;
    margin-top: 10px;
    border-radius: 10px;
    background-color: #f8f9fa;
`;

const AprovarMusicas = () => {
    const [pendingSongs, setPendingSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Create a ref for the audio element
    const audioRefs = useRef({});

    useEffect(() => {
        const fetchPendingSongs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/getMusicasPendentes');
                setPendingSongs(response.data);
            } catch (err) {
                setError('Erro ao buscar músicas pendentes.');
            } finally {
                setLoading(false);
            }
        };

        fetchPendingSongs();
    }, []);

    const handleApprove = async (songId) => {
        try {
            console.log('Aprovando música com ID:', songId);
            const response = await axios.patch(`http://127.0.0.1:3001/aprovarMusica/${songId}`);
            console.log('Resposta da aprovação:', response.data);
            setPendingSongs(prevSongs => prevSongs.filter(song => song._id !== songId));
        } catch (err) {
            console.error('Erro ao aprovar música:', err);
            setError('Erro ao aprovar a música.');
        }
    };

    const handleReject = async (songId) => {
        try {
            await axios.delete(`http://127.0.0.1:3001/rejeitarMusica/${songId}`);
            setPendingSongs(prevSongs => prevSongs.filter(song => song._id !== songId));
        } catch (err) {
            console.error('Erro ao rejeitar música:', err);
            setError('Erro ao rejeitar a música.');
        }
    };

    const filteredSongs = pendingSongs.filter(song =>
        song.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artista.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Navbar3 />
            <MusicListContainer>
                <SearchBar
                    type="text"
                    placeholder="Procurar músicas pendentes..."
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
                                <AudioPlayer
                                    ref={el => (audioRefs.current[song._id] = el)}
                                    controls
                                >
                                    <source src={`http://127.0.0.1:3001/musicas/${song.ficheiro}`} type="audio/mp3" />
                                    <source src={`http://127.0.0.1:3001/musicas/${song.ficheiro}`} type="audio/ogg" />
                                    <source src={`http://127.0.0.1:3001/musicas/${song.ficheiro}`} type="audio/wav" />
                                    Seu navegador não suporta o elemento de áudio.
                                </AudioPlayer>
                            </div>
                            <div>
                                <ApproveButton onClick={() => handleApprove(song._id)}>
                                    Aprovar
                                </ApproveButton>
                                <RejectButton onClick={() => handleReject(song._id)}>
                                    Rejeitar
                                </RejectButton>
                            </div>
                        </MusicListItem>
                    ))}
                </MusicList>
            </MusicListContainer>
        </div>
    );
};

export default AprovarMusicas;
