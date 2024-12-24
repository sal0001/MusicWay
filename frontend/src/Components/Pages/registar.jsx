import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import styled from 'styled-components';

const Register = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();


        if (nome.trim() === '' || email.trim() === '' || password.trim() === '') {
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:3001/home/registar', { nome, email, password });
            console.log('Response:', response.data);

            navigate('/login');
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
        navigate('/login');
    };

    return (
        <Container>~
            <Navbar />
            <FormContainer>
                <StyledForm onSubmit={handleRegister}>
                    <FormGroup>
                        <Label>Nome</Label>
                        <StyledInput
                            type="text"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Email</Label>
                        <StyledInput
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Password</Label>
                        <StyledInput
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </FormGroup>
                    <SubmitButton type="submit">Registar</SubmitButton>
                    <RedirectText onClick={handleLoginRedirect}>
                        Já se registou?
                    </RedirectText>
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
`;

const RedirectText = styled.p`
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

export default Register;
