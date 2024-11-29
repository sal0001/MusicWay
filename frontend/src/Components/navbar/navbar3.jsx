import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Logo/MusicWayLogo.png';
import axios from 'axios';

const Navbar3 = () => {
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
            <header id="header" className="header d-flex align-items-center fixed-top" style={styles.header}>
                <div className="container-fluid container-xl position-relative d-flex align-items-center">
                    <a
                        className="logo d-flex align-items-center me-auto"
                        onClick={clickIMAGE}
                        style={styles.logo}
                    >
                        <img
                            style={styles.logoImage}
                            src={logo}
                            alt="MusicWay Logo"
                        />
                    </a>

                    <nav id="navmenu" className="navmenu" style={styles.navMenu}>
                        <ul style={styles.navList}>
                            <li style={styles.navItem}>
                                <a href="" style={styles.navLink}>Músicas</a>
                            </li>
                            <li style={styles.navItem}>
                                <a href="/addCategoria" style={styles.navLink}>Categorias</a>
                            </li>
                            <li style={styles.navItem}>
                                <a
                                    style={{ ...styles.navLink, ...styles.logoutLink }}
                                    onClick={handleLogout}
                                    role="button"
                                    aria-label="Logout"
                                >
                                    Sair
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </div>
    );
};

const styles = {
    header: {
        backgroundColor: '#333',
        padding: '20px 20px',
        boxShadow: '0'
    },
    logo: {
        cursor: 'pointer',
        fontSize: '1.2em',
    },
    logoImage: {
        width: 150,
    },
    navMenu: {
        marginLeft: 'auto',
    },
    navList: {
        display: 'flex',
        listStyle: 'none',
        padding: 0,
        margin: 0,
        alignItems: 'center',
    },
    navItem: {
        margin: '0 20px',
    },
    navLink: {
        textDecoration: 'none',
        color: '#fff',
        fontSize: '1.1em',
        fontWeight: '500',
        transition: 'color 0.3s ease',
    },
    logoutLink: {
        backgroundColor: '#e74c3c',  
        padding: '10px 15px',  
        borderRadius: '5px',  
        color: '#fff', 
        fontWeight: 'bold',
    },
};

const hoverStyles = document.createElement("style");
hoverStyles.innerHTML = `
    a:hover {
        color: #3498db;
    }
    a[role="button"]:hover {
        background-color: #c0392b;
    }
`;
document.head.appendChild(hoverStyles);

export default Navbar3;
