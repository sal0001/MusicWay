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
    margin: 20px 0;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between; /* Space between items */
    align-items: center; /* Center items vertically */
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

const RemoveButton = styled(GreyButton)`
    background-color: #dc3545; /* Bootstrap's danger color */
    padding: 5px 10px; /* Smaller padding for a smaller button */
    width: 80px; /* Fixed width for the button */
    height: 30px; /* Fixed height for the button */
    font-size: 14px; /* Adjust font size for better appearance */
    display: flex; /* Flex to center text */
    align-items: center; /* Center text vertically */
    justify-content: center; /* Center text horizontally */

    &:hover {
        background-color: #c82333; /* Darker shade on hover */
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
                            <div>
                                <h5>{user.nome}</h5>
                                <p>Email: {user.email}</p>
                            </div>
                            <RemoveButton onClick={() => handleRemoveUser(user._id)}>Remover</RemoveButton>
                        </UserListItem>
                    ))}
                </UserList>
            </UserListContainer>
        </div>
    );
};

export default Main;
