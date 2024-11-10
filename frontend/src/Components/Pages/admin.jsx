import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar3 from '../navbar/navbar3';
import styled from 'styled-components';
import axios from 'axios';


const UserListContainer = styled.div`
    margin-top: 100px;
    padding: 40px;
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;


const UserList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin-top: 40px;
`;


const UserListItem = styled.li`
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


const SearchButton = styled.button`
    background-color: grey;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #ccc;
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


const SearchInput = styled.input`
    padding: 12px;
    width: 100%;
    max-width: 350px;
    border-radius: 25px;
    border: 2px solid #ccc;
    font-size: 16px;
    transition: border-color 0.3s ease;

    &:focus {
        border-color: black;
        outline: none;
    }
`;

const Main = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:3001/utilizadores'); 
                setUsers(response.data);
            } catch (err) {
                setError('Erro ao buscar os utilizadores.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = async () => {
        if (!searchEmail) {
            setError('Por favor, insira um email.');
            return;
        }
        
        try {
            const response = await axios.get('http://127.0.0.1:3001/buscarUtilizadorPorEmail', {
                params: { email: searchEmail },
            });
            setSearchResult(response.data);
            setError(''); 
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Erro ao buscar o utilizador.');
            } else {
                setError('Erro de rede. Tente novamente mais tarde.');
            }
            setSearchResult(null); 
        }
    };

    const handleRemoveUser = async (userId) => {
        try {
            await axios.delete(`http://127.0.0.1:3001/utilizadores/${userId}`); 
            setUsers(users.filter(user => user._id !== userId)); 
        } catch (err) {
            setError('Erro ao remover o utilizador.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Navbar3 />
            <UserListContainer>
                <div className="mb-4 d-flex justify-content-center">
                    <SearchInput
                        type="email"
                        placeholder="Digite o email do utilizador"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                    />
                    <SearchButton onClick={handleSearch} className="ml-3">Buscar</SearchButton>
                </div>

                {loading && <p>Carregando...</p>}
                {error && <p className="text-danger">{error}</p>}
                
                {searchResult && (
                    <UserListItem>
                        <div>
                            <h5>{searchResult.nome}</h5>
                            <p>Email: {searchResult.email}</p>
                        </div>
                    </UserListItem>
                )}

                <UserList>
                    {users.map(user => (
                        <UserListItem key={user._id}>
                            <div>
                                <h5>{user.nome}</h5>
                                <p>Email: {user.email}</p>
                            </div>
                            <RemoveButton onClick={() => handleRemoveUser(user._id)}>
                                <i className="fas fa-trash-alt"></i>
                            </RemoveButton>
                        </UserListItem>
                    ))}
                </UserList>
            </UserListContainer>
        </div>
    );
};

export default Main;
