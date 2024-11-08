import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Pages/Home';
import Login from './Components/Pages/login'; 
import Main from './Components/Pages/main'; 
import Registar from './Components/Pages/registar'; 
import Perfil from './Components/Pages/Perfil';
import AdicionarMusicas from './Components/Pages/addMusicas';
import AdicionarPlaylists from './Components/Pages/addPlaylists';
import Admin from './Components/Pages/admin';
import AdicionarCategorias from './Components/Pages/addCategoria';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home/login" element={<Login />} />
            <Route path="/home/registar" element={<Registar />} />
            <Route path="/main" element={<Main />} />
            <Route path="/main/Perfil" element={<Perfil />} />
            <Route path="/adicionarMusicas" element={<AdicionarMusicas />} />
            <Route path="/main/addPlaylists" element={<AdicionarPlaylists />} />
            <Route path="/addCategoria" element={<AdicionarCategorias />} />
            <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;