const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); 
const fs = require('fs');
const path = require('path');
const Utilizadores = require('../models/utilizadores');
const Musicas = require('../models/musicas');
const addMusic = require('../models/Novamusica'); 
const addPlaylist = require('../models/NovaPlaylist'); 
const Playlist = require('../models/playlists');
const jwt = require('jsonwebtoken');


const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "0b3b00e068669878e89a4dd4034d453577c076780a4a0803c714b644f075f68e";

mongoose.connect('mongodb://admin:senha123@127.0.0.1:27017/M&B', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.error('MongoDB connection error:', err));


const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Erro ao verificar o token:', err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Token inválido.' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ error: 'Token expirado.' });
        }
        res.status(500).json({ error: 'Erro ao processar token.' });
    }
};


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

        const user = new Utilizadores({ nome, email, password });
        await user.save();

        res.status(201).json({ message: 'Utilizador registrado com sucesso.', user });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Erro ao registrar utilizador: ' + err.message });
    }
});

app.post('/home/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e password são obrigatórios.' });
    }

    try {
        const user = await Utilizadores.findOne({ email }).lean();

        if (!user) {
            return res.status(400).json({ error: 'Email ou password incorretos.' });
        }

        if (user.password !== password) {
            return res.status(400).json({ error: 'Email ou password incorretos.' });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        const { password: _, ...userWithoutPassword } = user;

        if (email === "admin@gmail.com" && password === "123") {
            return res.status(200).json({ redirect: '/admin' });
        }

        return res.status(200).json({ token, user: userWithoutPassword });
        
    } catch (err) {
        console.error('Erro no servidor:', err);
        return res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});



app.get('/main/perfil', authenticate, async (req, res) => {
    try {
        const userId = req.user.id; 
        const user = await Utilizadores.findById(userId).lean();

        if (!user) {
            return res.status(404).json({ error: 'Utilizador não encontrado.' });
        }

        const { password, ...userWithoutPassword } = user;

        res.status(200).json(userWithoutPassword); 
    } catch (err) {
        console.error('Erro ao buscar utilizador:', err);
        res.status(500).json({ error: 'Erro ao buscar utilizador: ' + err.message });
    }
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
    if (!req.file || !req.body.nome || !req.body.artista) {
        return res.status(400).json({ error: 'Nome da música, artista e arquivo são obrigatórios.' });
    }

    try {
        const newMusic = {
            nome: req.body.nome,
            ficheiro: req.file.filename, 
            artista: req.body.artista,
        };

        await addMusic(newMusic); 

        res.status(200).json({
            file: req.file,
            message: 'Ficheiro salvo com sucesso e informações da música adicionadas ao banco de dados.',
        });
    } catch (error) {
        console.error('Erro ao processar a requisição:', error);
        return res.status(500).json({ error: 'Erro ao publicar a música.' });
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
    const { nome, utilizador, musicas} = req.body;

    if (!nome || !utilizador) {
        return res.status(400).json({ error: 'Nome e usuário são obrigatórios.' });
    }

    try {
        const novaPlaylist = await addPlaylist({ nome, utilizador, musicas });
        res.status(201).json(novaPlaylist);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar a nova playlist: ' + error.message });
    }
});


app.get('/VerPlaylists', async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('musicas').populate('utilizador');
        res.status(200).json(playlists);
    } catch (error) {
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

app.get('/buscarUtilizadorPorEmail', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
    }

    try {
        const utilizador = await Utilizadores.findOne({ email }).lean(); 
        if (!utilizador) {
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        }
        res.status(200).json(utilizador);
    } catch (error) {
        console.error('Erro ao buscar utilizador:', error);
        res.status(500).json({ error: 'Erro ao buscar utilizador.' });
    }
});

app.listen(3001, () => {
    console.log("Server listening on port 3001");
});
