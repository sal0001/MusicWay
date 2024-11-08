import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Navbar2 from '../navbar/navbar2';

const Container = styled.div`
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
`;

const UserDetails = styled.div`
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background-color: #f9f9f9;
`;

const Perfil = () => {
    const [user, setUser] = useState({ nome: '', email: '' }); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/auth', { withCredentials: true });
                console.log(response.data); 
                if (response.data && response.data.user) {
                    setUser(response.data.user);
                } else {
                    setUser({ nome: '', email: '' });
                }
            } catch (err) {
                console.error(err); 
                setUser({ nome: '', email: '' });
            }
        };
        fetchUserData();
    }, []);

    return (
        <Container>
            <Navbar2 />
            <br />
            <br />
            <br />
            <UserDetails>
                <p><strong>Nome:</strong> {user.nome}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </UserDetails>
        </Container>
    );
};

export default Perfil;
