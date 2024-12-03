import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Pages/login'; 
import Main from './Components/Pages/main'; 
import Registar from './Components/Pages/registar'; 
import Perfil from './Components/Pages/Perfil';
import AdicionarMusicas from './Components/Pages/addMusicas';
import Admin from './Components/Pages/admin';
import AdicionarCategorias from './Components/Pages/addCategoria';
import Musicas from './Components/Pages/Musicas';
import AprovarMusicas from './Components/Pages/aprovarMusicas';


function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
          <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registar" element={<Registar />} />
            <Route path="/main/Perfil" element={<Perfil />} />
            <Route path="/adicionarMusicas" element={<AdicionarMusicas />} />
            <Route path="/addCategoria" element={<AdicionarCategorias />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/musicas" element={<Musicas />} />
            <Route path="/aprovarMusicas" element={<AprovarMusicas />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;