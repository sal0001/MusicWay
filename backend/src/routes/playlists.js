const express = require("express");
const mongoose = require("mongoose");
const Playlist = require("../../models/playlists");
const Musicas = require("../../models/musicas");
const { uploadImage } = require("../config/middlewares/multer");
const verifyToken = require("../config/middlewares/auth");

const router = express.Router();

router.post("/addPlaylist", uploadImage.single("imagem"), async (req, res) => {
  try {
    const { nome, descricao = "", musicas, utilizador } = req.body;
    const imagem = req.file ? req.file.filename : null;

    if (!nome || !utilizador || !imagem) {
      return res.status(400).json({ error: "Nome, utilizador e imagem são obrigatórios." });
    }

    let musicasArray = [];
    if (musicas) {
      if (typeof musicas === "string") {
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
      message: "Playlist criada com sucesso!",
      playlist: newPlaylist,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro interno ao criar playlist. Tente novamente mais tarde.",
    });
  }
});

router.get("/playlists", verifyToken, async (req, res) => {
  try {
    const playlists = await Playlist.find({ utilizador: req.user.userId });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar playlists" });
  }
});

router.get("/playlist/:id", async (req, res) => {
  const playlistId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ error: "ID de playlist inválido" });
    }

    const playlist = await Playlist.findById(playlistId).exec();
    if (!playlist) {
      return res.status(404).json({ error: "Playlist não encontrada" });
    }

    const musicas = await Musicas.find({ _id: { $in: playlist.musicas } }).exec();
    res.status(200).json({ playlist, musicas });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a playlist." });
  }
});

router.delete("/playlist/:playlistId/remove-musica/:musicaId", async (req, res) => {
  const { playlistId, musicaId } = req.params;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist não encontrada" });
    }

    playlist.musicas = playlist.musicas.filter((id) => id.toString() !== musicaId);
    await playlist.save();
    res.status(200).json({ message: "Música removida com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover música da playlist" });
  }
});

router.post("/playlist/:playlistId/add-musica/:musicaId", async (req, res) => {
  const { playlistId, musicaId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ error: "ID de playlist inválido" });
    }

    if (!mongoose.Types.ObjectId.isValid(musicaId)) {
      return res.status(400).json({ error: "ID de música inválido" });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist não encontrada" });
    }

    if (playlist.musicas.includes(musicaId)) {
      return res.status(400).json({ error: "Música já está na playlist" });
    }

    playlist.musicas.push(musicaId);
    await playlist.save();
    res.status(200).json({ message: "Música adicionada com sucesso", playlist });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar música à playlist" });
  }
});

router.delete("/playlist/:id", async (req, res) => {
  const playlistId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ error: "ID de playlist inválido" });
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);
    if (!deletedPlaylist) {
      return res.status(404).json({ error: "Playlist não encontrada" });
    }

    res.status(200).json({ message: "Playlist removida com sucesso" });

  } catch (error) {
    res.status(500).json({ error: "Erro ao remover a playlist" });
  }
});

module.exports = router;