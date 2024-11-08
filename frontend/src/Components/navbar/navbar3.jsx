import React from 'react';
import './navbar2.css';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { LuListMusic } from "react-icons/lu";
import logo from '../Logo/MusicWaveLogo.png';
import axios from 'axios';

const Navbar2 = () => {
    const navigate = useNavigate();

    const clickIMAGE = () => {
        navigate('/admin');
    };


    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
        
            navigate('/');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            alert('Erro ao fazer logout. Tente novamente.');
        }
    };

    return (
        <div>
            <header id="header" className="header d-flex align-items-center fixed-top">
                <div className="container-fluid container-xl position-relative d-flex align-items-center">
                    <a
                        className="logo d-flex align-items-center me-auto"
                        onClick={clickIMAGE}
                        style={{ cursor: 'pointer', fontSize: '1em' }}
                    >
                        <img
                            style={{ width: 100 }}
                            src={logo}
                            alt="MusicWay Logo"
                        />
                    </a>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>
                    <nav id="navmenu" className="navmenu">
                        <ul>
                            <li className="dropdown">
                                <a href="#" aria-haspopup="true" aria-expanded="false">
                                    <LuListMusic style={{ fontSize: '1.5em' }} />
                                    <i className="toggle-dropdown" style={{ fontWeight: 'bold' }}></i>
                                </a>
                                <ul>
                                    <li><a href="/adicionarMusicas">publicar musicas</a></li>
                                    <li><a href="/addCategoria">criar categoria</a></li>
                                </ul>
                            </li>
                            <li className="dropdown">
                                <a href="#" aria-haspopup="true" aria-expanded="false">
                                    <CgProfile style={{ fontSize: '1.5em' }} />
                                    <i className="toggle-dropdown" style={{ fontWeight: 'bold' }}></i>
                                </a>
                                <ul>
                                    <li>
                                        <a style={{ color: 'red' }} onClick={handleLogout} role="button" aria-label="Logout">Sair</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default Navbar2;
