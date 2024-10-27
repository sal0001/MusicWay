import React from 'react';
import './navbar2.css';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { MdPlaylistAddCheckCircle } from "react-icons/md";
import { LuListMusic } from "react-icons/lu";
import logo from '../Logo/MusicWayLogo.png';

const Navbar2 = () => {
    const navigate = useNavigate();

    const clickIMAGE = () => {
        navigate('/main');
    };

    return (
        <div>
            
            <header id="header" className="header d-flex align-items-center fixed-top">
            
                <div className="container-fluid container-xl position-relative d-flex align-items-center">
                    <a
                        className="logo d-flex align-items-center me-auto"
                        onClick={clickIMAGE}
                        style={{ cursor: 'pointer', fontSize: '1em'}}
                    >
                        <img
                            style={{ width: 200}}
                            src={logo}
                        />
                        
                    </a>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"></link>
                    <nav id="navmenu" className="navmenu">
                        <ul>
                            <li className="dropdown">
                                <a href="#">
                                <CgProfile style={{ fontSize: '1.5em' }} />
                                    <i className="toggle-dropdown" style={{ fontWeight: 'bold' }}></i>
                                </a>
                                <ul>
                                    <li><a href="/main/Perfil">O meu perfil</a></li>
                                    <li><a style={{ color: 'red' }} href="/home/login">Sair</a></li>
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
