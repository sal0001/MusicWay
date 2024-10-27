import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar3 from '../navbar/navbar3';
import styled from 'styled-components';
import axios from 'axios';

const UserListContainer = styled.div`
    padding: 100px;
    width: 100%;
`;

const UserList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const UserListItem = styled.li`
    background-color: #f8f9fa;
    margin: 10px 0;
    padding: 15px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const GreyButton = styled.button`
    background-color: #6c757d; /* Bootstrap's secondary color */
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
        background-color: #5a6268; /* Darker shade on hover */
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Navbar3 />
            <UserListContainer>
     
                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Digite o email do utilizador"
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="form-control"
                    />
                    <GreyButton onClick={handleSearch} className="mt-2">Buscar</GreyButton>
                </div>

                {loading && <p>Carregando...</p>}
                {error && <p className="text-danger">{error}</p>}
                
    
                {searchResult && (
                    <UserListItem>
                        <h5>{searchResult.nome}</h5>
                        <p>Email: {searchResult.email}</p>
                    </UserListItem>
                )}

        
                <UserList>
                    {users.map(user => (
                        <UserListItem key={user._id}>
                            <h5>{user.nome}</h5>
                            <p>Email: {user.email}</p>
                        </UserListItem>
                    ))}
                </UserList>
            </UserListContainer>
        </div>
    );
};

export default Main;
