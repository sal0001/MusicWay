import React from 'react';
import './home.css';
import './home.scss';
import Navbar from '../navbar/navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = () => {
  return (
    <div style={{ marginTop: '200px' }}> 
      <Navbar />

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      <header id="h1" className="masthead text-white text-center">
        <div className="container d-flex align-items-center flex-column">
          <h1 style={{ color: 'black', fontWeight: 'bold' }} className="masthead-heading text-uppercase mb-0">
            Ouve qualquer música com apenas um clique
          </h1>
          <br />
          <a href="/home/login" id="bt1" style={{ fontWeight: 'bold' }} className="button">Ouve já</a>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </header>

      <br />
      <br />
      
      <section className="feature_section">
        <div className="container">
          <div className="feature_container">
            <div className="box">
              <div className="img-box">
                <img
                  style={{ width: 100, fontWeight: 'bold' }}
                  src="https://cdn-icons-png.flaticon.com/512/8662/8662248.png"
                  alt="Criar Conta"
                />
              </div>
              <h5 className="name">Cria conta</h5>
            </div>

            <div className="box active">
              <div className="img-box">
                <img
                  style={{ width: 100, fontWeight: 'bold' }}
                  src="https://cdn-icons-png.flaticon.com/512/11031/11031276.png"
                  alt="Senta-te a ouvir"
                />
              </div>
              <h5 className="name">Senta-te a ouvir</h5>
            </div>

            <div className="box">
              <div className="img-box">
                <img
                  style={{ width: 100, fontWeight: 'bold' }}
                  src="https://cdn-icons-png.flaticon.com/512/9593/9593868.png"
                  alt="e Desfruta"
                />
              </div>
              <h5 className="name">e Desfruta</h5>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
