const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); 
const fs = require('fs');
const path = require('path');
const session = require('express-session'); 
const Utilizadores = require('../models/utilizadores');
const Musicas = require('../models/musicas');
const addMusic = require('../models/Novamusica'); 
const addPlaylist = require('../models/NovaPlaylist'); 
const Playlist = require('../models/playlists');
const Categoria = require('../models/Categorias')
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');



const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

const PORT = 3001;

app.use(session({
    key: "userId",
    secret: '123456789', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

mongoose.connect('mongodb://localhost:27017/M&B', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/auth', (req, res) => {
    if (req.session.userId) { 
        res.json({ authenticated: true, userId: req.session.userId, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

app.post('/home/registar', async (req, res) => {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const existingUser = await Utilizadores.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Utilizadores({ nome, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'Utilizador registrado com sucesso.', user });
    } catch (err) {
        console.error('Erro ao registrar utilizador:', err); 
        res.status(500).json({ error: 'Erro ao registrar utilizador: ' + err.message });
    }
});

app.post('/home/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }

    try {
    
        const user = await Utilizadores.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Email ou password incorretos.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Email ou password incorretos.' });
        }

    
        const result = [user]; 

        req.session.userId = result[0]._id;
        req.session.user = result[0]; 

    
        const { password: _, ...userWithoutPassword } = result[0].toObject(); 
        return res.status(200).json({ user: userWithoutPassword });
        
    } catch (err) {
        console.error('Erro no servidor:', err);
        return res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout failed:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('userId');
        res.json({ message: 'Logged out successfully' });
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const musicDirectory = path.join(__dirname, '../musicas');

      
        if (!fs.existsSync(musicDirectory)) {
            fs.mkdirSync(musicDirectory, { recursive: true });
        }

        cb(null, musicDirectory);
    },
    filename: (req, file, cb) => {
      
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});


const upload = multer({ storage: storage });


app.post('/addMusicas', upload.single('file'), async (req, res) => {
    try {
      
        const { nome, artista, categoriaId } = req.body;
        const file = req.file;  

        
        if (!nome || !artista || !file || !categoriaId) {
            return res.status(400).json({ error: 'Por favor, preencha todos os campos: nome, artista, arquivo e categoria.' });
        }

       
        const categoria = await Categoria.findById(categoriaId);
        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

      
        const musica = new Musicas({
            nome,
            artista,
            categoria: categoriaId,
            ficheiro: file.path,  
        });

        await musica.save();  
        return res.status(200).json({ message: 'Música publicada com sucesso!', musica });

    } catch (error) {
        console.error('Erro ao adicionar música:', error);
        return res.status(500).json({ error: 'Erro ao adicionar música. Tente novamente.' });
    }
});

app.get('/musicas', async (req, res) => {
    try {
        const musicas = await Musicas.find();
        res.status(200).json(musicas);
    } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        res.status(500).json({ error: 'Erro ao buscar músicas.' });
    }
});

app.post('/CriarPlaylists', async (req, res) => {
    const { nome, utilizador, musicas } = req.body;

    if (!nome || !utilizador) {
        return res.status(400).json({ error: 'Nome e usuário são obrigatórios.' });
    }

    try {
        const novaPlaylist = new addPlaylist({ nome, utilizador, musicas }); 
        await novaPlaylist.save(); 
        res.status(201).json(novaPlaylist);
    } catch (error) {
        console.error('Erro ao criar a nova playlist:', error);
        res.status(500).json({ error: 'Erro ao criar a nova playlist: ' + error.message });
    }
});

app.get('/VerPlaylists', async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('musicas').populate('utilizador');
        res.status(200).json(playlists);
    } catch (error) {
        console.error('Erro ao buscar as playlists:', error);
        res.status(500).json({ error: 'Erro ao buscar as playlists.' });
    }
});

app.get('/utilizadores', async (req, res) => {
    try {
        const utilizadores = await Utilizadores.find(); 
        res.status(200).json(utilizadores); 
    } catch (error) {
        console.error('Erro ao buscar utilizadores:', error);
        res.status(500).json({ error: 'Erro ao buscar utilizadores.' });
    }
});

app.delete('/utilizadores/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ error: 'Utilizador não encontrado.' });
        }

        res.status(200).json({ message: 'Utilizador removido com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover o utilizador.' });
    }
});


app.post('/addCategoria', async (req, res) => {
   
    if (!req.body.nome) {
        return res.status(400).json({ error: 'O nome da categoria é obrigatório.' });
    }

    try {
       
        const novaCategoria = new Categoria({
            nome: req.body.nome
        });

       
        const categoriaSalva = await novaCategoria.save();

    
        res.status(200).json({
            message: 'Categoria adicionada com sucesso.',
            categoria: categoriaSalva
        });
    } catch (error) {
        console.error('Erro ao adicionar categoria:', error);
        
        return res.status(500).json({ error: 'Erro ao adicionar a categoria.' });
    }
});

app.get('/getCategorias', async (req, res) => {
    try {
       
        const categorias = await Categoria.find();
        
        if (!categorias || categorias.length === 0) {
            return res.status(404).json({ error: 'Nenhuma categoria encontrada.' });
        }

        res.status(200).json(categorias);
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
