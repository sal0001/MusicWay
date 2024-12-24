import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import styled from 'styled-components';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Resetando a mensagem de erro

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
                { withCredentials: true } // Enviando cookies de autenticação
            );

            if (response.status === 200) {
                const { token, user } = response.data;

                // Armazenando os dados no localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Redirecionando conforme o tipo de usuário
                if (user.email === 'admin@gmail.com') {
                    navigate('/admin');
                } else {
                    navigate('/');
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
            setLoading(false); // Finaliza o estado de loading
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/registar');
    };

    return (
        <Container>
            <Navbar />
            <FormContainer>
                <StyledForm onSubmit={handleLogin}>
                    <FormGroup>
                        <Label htmlFor="email">Email</Label>
                        <StyledInput
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="password">Password</Label>
                        <StyledInput
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <SubmitButton type="submit" disabled={loading}>
                        {loading ? 'A entrar...' : 'Entrar'}
                    </SubmitButton>
                    <RegisterText onClick={handleRegisterRedirect}>
                        Ainda não se registou?
                    </RegisterText>
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                </StyledForm>
            </FormContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    background: linear-gradient(to bottom, #d3d3d3, grey);

`;

const FormContainer = styled.div`
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 5px;
    color: #333;
`;

const StyledInput = styled.input`
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    transition: border-color 0.3s ease;
    &:focus {
        border-color: black;
        outline: none;
    }
`;

const SubmitButton = styled.button`
    padding: 12px;
    font-size: 1.1em;
    background-color: grey;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #ccc;
    }
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const RegisterText = styled.p`
    text-align: center;
    font-size: 1em;
    color: grey;
    cursor: pointer;
    margin-top: 10px;
    &:hover {
        text-decoration: underline;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 1em;
    text-align: center;
    margin-top: 10px;
`;

export default Login;
