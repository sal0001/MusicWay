
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './navbar.css'
import { useNavigate } from 'react-router-dom';
import logo from '../Logo/MusicWaveLogo.png';

const Navbar1 = () => {
  const navigate = useNavigate();
  
  const clickIMG = () => {
    navigate('/');

  }
  return (
 
    <header id="header" class="header d-flex align-items-center fixed-top">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet"></link>
    <div class="container-fluid container-xl position-relative d-flex align-items-center">
    <a
                        className="logo d-flex align-items-center me-auto"
                        onClick={clickIMG}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            style={{ width: "100px"}}
                            src={logo}
                    
                        />
                    </a>
      <nav id="navmenu" class="navmenu">
        <ul>
          <button className="navbar-btn btn btn-custom" style={{ fontWeight: 'bold', border: '1px dashed #f0f0f0', marginRight: '10px' }} onClick={() => window.location.href = '/home/login'} id="btt">Entrar</button>
          <button className="navbar-btn btn btn-custom" style={{ fontWeight: 'bold', border: '1px dashed #f0f0f0' }} onClick={() => window.location.href = '/home/registar'} id="btt">Criar</button>
        </ul>
        <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
      </nav>

    </div>
  </header>
  );
};

export default Navbar1;
