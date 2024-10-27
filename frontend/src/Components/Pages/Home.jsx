import React from 'react';
import './home.css'
import './home.scss'
import Navbar from '../navbar/navbar'; 
import '@fortawesome/fontawesome-free/css/all.min.css';

const Home = () => {
  return (
    
    <div >
      <Navbar /> 
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"></link>
      <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
/>
       <header id="h1" class="masthead text-white text-center">
        
            <div class="container d-flex align-items-center flex-column">
            <h1 style={{color: 'black', fontWeight: 'bold'}} class="masthead-heading text-uppercase mb-0">Ouve qualquer musica em apenas um clique</h1>
            <br />
            <a href="/home/login" id="bt1" style={{ fontWeight: 'bold' }} class="button">Ouve já</a>
           
              <br />
              
                <br />
            </div>
        </header>
        <br />
        <br /> 
        <section class="feature_section">
    <div class="container">
      <div class="feature_container">
        <div class="box">
          <div class="img-box">
          
                <img style={{width: 100, fontWeight: 'bold'}} src={'https://cdn-icons-png.flaticon.com/512/8662/8662248.png'} />
               
         
          </div>
          <h5 class="name">
            Cria conta
          </h5>
        </div>
        <div class="box active">
        <div class="img-box">
          
          <img style={{width: 100, fontWeight: 'bold'}} src={'https://cdn-icons-png.flaticon.com/512/11031/11031276.png'} />
         
   
    </div>
          <h5 class="name">
            Senta-te a ouvir 
          </h5>
        </div>
        <div class="box">
        <div class="img-box">
          
          <img style={{width: 100, fontWeight: 'bold'}} src={'https://cdn-icons-png.flaticon.com/512/9593/9593868.png'} />
         
   
    </div>
          <h5 class="name">
            e Desfruta
          </h5>
        </div>
      </div>
    </div>
  </section>
  </div>
    
  );
};

export default Home;
