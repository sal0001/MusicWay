const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./db");
const corsMiddleware = require("./middlewares/cors");
const authRoutes = require("../routes/auth");
const musicasRoutes = require("../routes/musicas");
const utilizadoresRoutes = require("../routes/utilizadores");
const categoriasRoutes = require("../routes/categorias");
const playlistsRoutes = require("../routes/playlists");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

// Conexão à base de dados
connectDB();

// Rotas
app.use(authRoutes);
app.use(musicasRoutes);
app.use(utilizadoresRoutes);
app.use(categoriasRoutes);
app.use(playlistsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta http://127.0.0.1:${PORT}`);
});