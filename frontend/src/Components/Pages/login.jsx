import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';
import Navbar from '../navbar/navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
    
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
    
        if (!trimmedEmail || !trimmedPassword) {
            setErrorMessage('Email e Password são obrigatórios.');
            return;
        }
    
        try {
            setLoading(true);
    
            const response = await axios.post(
                'http://127.0.0.1:3001/home/login', 
                { email: trimmedEmail, password: trimmedPassword }, 
                { headers: { 'Content-Type': 'application/json' } }
            );
    
            if (response.status === 200) {
                
                if (response.data.redirect) {
                    
                    navigate(response.data.redirect);
                } else {
                    const { token, user } = response.data;
    
                 
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
    
                  
                    navigate('/main');
                }
            }
        } catch (error) {
            console.error('Erro no login:', error);
            if (error.response) {
                const errorMessage = error.response.data.error || 'Email ou Password incorretos. Tente novamente.';
                setErrorMessage(errorMessage);
            } else if (error.request) {
                setErrorMessage('Erro de rede. Tente novamente mais tarde.');
            } else {
                setErrorMessage('Ocorreu um erro ao processar a solicitação. Tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    
    
    const handleRegisterRedirect = () => {
        
        navigate('/home/registar'); 
    };

    const estiloCentralizado = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0,
    };

    return (
        <div>
            <Navbar /> 
            <div style={estiloCentralizado}>
                <form onSubmit={handleLogin} style={{ border: '1px solid black', padding: '20px', borderRadius: '20px' }}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}> 
                        {loading ? 'A entrar...' : 'Entrar'}
                    </button>
                    <p style={{ cursor: 'pointer', color: 'black' }} onClick={handleRegisterRedirect}>
                        Ainda não se registou?
                    </p>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default Login;
