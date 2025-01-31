const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Utilizadores = require('../models/utilizadores');
const Musicas = require('../models/musicas');
const Playlist = require('../models/playlists');
const Roles = require('../models/Roles');
const Categoria = require('../models/Categorias')
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(cookieParser());
app.options('*', cors()); 
const PORT = 3001;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
    res.setHeader('Access-Control-Allow-Credentials', 'true'); 
  
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    next();
  });


mongoose.connect('mongodb://localhost:27017/M&B', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Conectado a base de dados.'))
    .catch(err => console.error('Erro a conectar a base de dados:', err));


if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in .env file!');
    process.exit(1);
}


app.get('/auth', (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ authenticated: false, message: 'Cabeçalho de autorização ausente.' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ authenticated: false, message: 'Token ausente no cabeçalho de autorização.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = {
            userId: decoded.userId,
            nome: decoded.nome,
            email: decoded.email,
        };

        return res.status(200).json({ authenticated: true, user });
    } catch (err) {
        console.error('Erro na verificação do token:', err);
        return res.status(401).json({ authenticated: false, message: 'Token inválido ou expirado.' });
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

        let role = await Roles.findOne({ nome: 'utilizador' });
        if (!role) {
            role = new Roles({ nome: 'utilizador' });
            await role.save();
        }

        const user = new Utilizadores({
            nome,
            email,
            password: hashedPassword,
            role: role._id
        });

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
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {

        const user = await Utilizadores.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'Email ou senha incorretos.' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Email ou senha incorretos.' });
        }

        const token = jwt.sign(
            { userId: user._id, nome: user.nome, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '365d' }
        );

        res.json({
            message: 'Login realizado com sucesso.',
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

//Logout
app.post('/logout', (req, res) => {

    res.clearCookie('token', { path: '/' });
    return res.status(200).json({ message: 'Logout bem-sucedido.' });
});



//Musicas

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
            status: 'pendente',
        });


        await musica.save();


        return res.status(200).json({ message: 'Música publicada com sucesso!', musica });

    } catch (error) {
        console.error('Erro ao adicionar música:', error);
        return res.status(500).json({ error: 'Erro ao adicionar música. Tente novamente.' });
    }
});


app.get('/getMusicasPendentes', async (req, res) => {
    try {
        const musicasPendentes = await Musicas.find({ status: 'pendente' });
        res.status(200).json(musicasPendentes);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter músicas pendentes' });
    }
});


app.use('/musicas', cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
}), express.static(path.join(__dirname, '../musicas')));

app.get('/musicas', async (req, res) => {
    try {
        const musicas = await Musicas.find();
        res.status(200).json(musicas);
    } catch (error) {
        console.error('Erro ao buscar músicas:', error);
        res.status(500).json({ error: 'Erro ao buscar músicas.' });
    }
});

app.get('/musicas/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const musica = await Musicas.findById(id); 

        if (!musica) {
            
            return res.status(404).json({ error: 'Música não encontrada.' });
        }

        res.status(200).json(musica); 
    } catch (error) {
        console.error('Erro ao buscar música por ID:', error);
        res.status(500).json({ error: 'Erro ao buscar música.' });
    }
});


app.get('/musicas/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../musicas', filename);

    res.set('Access-Control-Allow-Origin', 'http://localhost:3000'); 
    res.set('Cache-Control', 'no-store');

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error sending file');
        }
    });
});

app.patch('/aprovarMusica/:id', cors(), async (req, res) => { 
    const { id } = req.params;
    console.log('Aprovando música com ID:', id);

    try {
        const musica = await Musicas.findById(id);

        if (!musica) {
            return res.status(404).send({ error: 'Música não encontrada' });
        }

        musica.status = 'aprovado';
        await musica.save();

        console.log('Música aprovada:', musica);
        res.status(200).send({ message: 'Música aprovada com sucesso', musica });

    } catch (error) {
        console.error('Erro ao aprovar música:', error);
        res.status(500).send({ error: 'Erro ao aprovar música' });
    }
});

app.delete('/rejeitarMusica/:id', async (req, res) => {
    try {
        const { id } = req.params;


        const musica = await Musicas.findById(id);
        if (!musica) {
            return res.status(404).send({ error: 'Música não encontrada' });
        }

        await Musicas.findByIdAndDelete(id);
        res.status(200).send({ message: 'Música removida com sucesso' });
    } catch (error) {
        console.error('Erro ao remover a música:', error);
        res.status(500).send({ error: 'Erro ao remover a música' });
    }
});

app.delete('/musicas/:id', async (req, res) => {
    try {
        const { id } = req.params;


        const musica = await Musicas.findById(id);
        if (!musica) {
            return res.status(404).send({ error: 'Música não encontrada' });
        }


        await Musicas.findByIdAndDelete(id);
        res.status(200).send({ message: 'Música removida com sucesso' });
    } catch (error) {
        console.error('Erro ao remover a música:', error);
        res.status(500).send({ error: 'Erro ao remover a música' });
    }
});



// Utilizadores
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


// Categorias
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

app.delete('/removeCategoria/:categoriaId', async (req, res) => {
    try {
        const categoriaId = req.params.categoriaId;

        const result = await Categoria.findByIdAndDelete(categoriaId);

        if (!result) {
            return res.status(404).json({ message: 'Categoria não encontrada.' });
        }

        res.status(200).json({ message: 'Categoria removida com sucesso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao remover a categoria.' });
    }
});

// Playlists

app.post('/addPlaylist', upload.single('imagem'), async (req, res) => {
    try {
        const { nome, descricao = '', musicas, utilizador } = req.body;

        const imagem = req.file ? req.file.filename : null;

        if (!nome || !utilizador || !imagem) {
            return res.status(400).json({ error: 'Nome, utilizador e imagem são obrigatórios.' });
        }

        let musicasArray = [];
        if (musicas) {
            if (typeof musicas === 'string') {
                try {
                    musicasArray = JSON.parse(musicas);
                } catch (error) {
                    return res.status(400).json({ error: 'O campo "musicas" deve conter um JSON válido.' });
                }
            } else if (Array.isArray(musicas)) {
                musicasArray = musicas;
            } else {
                return res.status(400).json({ error: 'O campo "musicas" deve ser um array ou um JSON válido.' });
            }
        }

        const newPlaylist = new Playlist({
            nome,
            musicas: musicasArray,
            utilizador,
            imagem,
        });

        await newPlaylist.save();

        res.status(201).json({
            message: 'Playlist criada com sucesso!',
            playlist: newPlaylist
        });
    } catch (error) {
        console.error('Erro ao criar playlist:', error.message || error);
        res.status(500).json({ error: 'Erro interno ao criar playlist. Tente novamente mais tarde.' });
    }
});

app.get('/playlists', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error.message);
        res.status(500).json({ error: 'Erro ao buscar playlists' });
    }
});

app.get('/playlist/:id', async (req, res) => {
    const playlistId = req.params.id;
  
    try {
      1
      if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        return res.status(400).json({ error: 'ID de playlist inválido' });
      }
  
      const playlist = await Playlist.findById(playlistId).exec();
  
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist não encontrada' });
      }

      const musicas = await Musicas.find({ '_id': { $in: playlist.musicas } }).exec();
  
      res.status(200).json({ playlist, musicas });
  
    } catch (error) {
      console.error('Erro ao buscar a playlist:', error);
      res.status(500).json({ error: 'Erro ao buscar a playlist.' });
    }
  });



app.listen(PORT, () => {
    console.log(`Servidor a correr na porta http://127.0.0.1:${PORT}`);
});
