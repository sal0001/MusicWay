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
const Categoria = require('../models/Categorias')
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
    credentials: true, 
  }));
app.use(cookieParser());
const PORT = 3001;


mongoose.connect('mongodb://localhost:27017/M&B', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB.'))
.catch(err => console.error('Erro a conecatar com mongoDB:', err));


if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in .env file!');
    process.exit(1); 
}


app.get('/auth', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ authenticated: false, message: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = {
            userId: decoded.userId,
            nome: decoded.nome,  
            email: decoded.email,
        };

        return res.json({ authenticated: true, user }); 
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ authenticated: false, message: 'Invalid or expired token.' });
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

     
        const token = jwt.sign(
            { userId: user._id, nome: user.nome, email: user.email },  
            process.env.JWT_SECRET,                                    
            { expiresIn: '365d' }                                       
        );

       
        res.json({
            message: 'Login successful',
            token,
            user: {
                nome: user.nome,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Erro no servidor:', err);
        return res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});


app.post('/logout', (req, res) => {
    
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    return res.json({ message: 'Logout successful.' });
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

      
        const ficheiroNome = path.basename(file.path);  

     
        const musica = new Musicas({
            nome,
            artista,
            categoria: categoriaId,
            ficheiro: ficheiroNome,  
        });


        await musica.save();  

    
        return res.status(200).json({ message: 'Música publicada com sucesso!', musica });

    } catch (error) {
        console.error('Erro ao adicionar música:', error);
        return res.status(500).json({ error: 'Erro ao adicionar música. Tente novamente.' });
    }
});

app.use('/musicas', express.static(path.join(__dirname, '../musicas')));
app.get('/musicas', async (req, res) => {
    try {
        const musicas = await Musicas.find();
        res.status(200).json(musicas);
    } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        res.status(500).json({ error: 'Erro ao buscar músicas.' });
    }
});

app.get('/musicas/:filename', (req, res) => {
    const filename = req.params.filename; 
    const filePath = path.join(__dirname, '../musicas', filename); 
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
        }
    });
});

app.delete('/musicas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await MusicaModel.findByIdAndDelete(id);
        res.status(200).send({ message: 'Música removida com sucesso' });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao remover a música' });
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

app.get('/utilizadores/email', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'O email é obrigatório.' });
    }

    try {
        const utilizador = await Utilizadores.findOne({ email });

        if (!utilizador) {
            return res.status(404).json({ error: 'Utilizador não encontrado.' });
        }

        res.status(200).json(utilizador);
    } catch (error) {
        console.error('Erro ao buscar utilizador por email:', error);
        res.status(500).json({ error: 'Erro ao buscar utilizador por email.' });
    }
});

app.put('/up_utilizadores/:id', async (req, res) => {
    const userId = req.params.id;
    const { nome, email } = req.body;

    try {
        const result = await User.findByIdAndUpdate(userId, { nome, email }, { new: true, runValidators: true });

        if (!result) {
            return res.status(404).json({ error: 'Utilizador não encontrado.' });
        }

        res.status(200).json({ message: 'Perfil atualizado com sucesso.', user: result });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro ao atualizar o perfil. Tente novamente.' });
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
    console.log(`Servidor a rodar na porta http://127.0.0.1:${PORT}`);
});
