import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import './registar.css';

const Register = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validate input fields
        if (nome.trim() === '' || email.trim() === '' || password.trim() === '') {
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:3001/home/registar', { nome, email, password });
            console.log('Response:', response.data);

            // Navigate to login page after successful registration
            navigate('/home/login');
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Erro no registro. Tente novamente.');
            }
        }
    };

    const handleLoginRedirect = () => {
        navigate('/home/login');
    };

    const estiloCentralizado = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0
    };

    return (
        <div>
            <Navbar />
            <div style={estiloCentralizado}>
                <form onSubmit={handleRegister} style={{ border: '1px solid black', padding: '20px', borderRadius: '10px' }}>
                    <label>Nome</label>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Registar</button>
                    <p style={{ cursor: 'pointer', color: 'black' }} onClick={handleLoginRedirect}>
                        Já se registou?
                    </p>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;
