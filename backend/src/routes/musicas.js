const express = require("express");
const Musicas = require("../../models/musicas");
const Categoria = require("../../models/Categorias");
const { uploadMusic } = require("../config/middlewares/multer");
const path = require("path");

const router = express.Router();

router.post(
  "/addMusicas",
  uploadMusic.fields([{ name: "file" }, { name: "imagem" }]),
  async (req, res) => {
    try {
      const { nome, artista, categoriaId } = req.body;
      const file = req.files["file"][0];
      const imagem = req.files["imagem"][0];

      if (!nome || !artista || !file || !categoriaId || !imagem) {
        return res.status(400).json({
          error: "Por favor, preencha todos os campos: nome, artista, arquivo de música, imagem e categoria.",
        });
      }

      const categoria = await Categoria.findById(categoriaId);
      if (!categoria) {
        return res.status(404).json({ error: "Categoria não encontrada." });
      }

      const ficheiroNome = path.basename(file.path);
      const imagemNome = path.basename(imagem.path);

      const musica = new Musicas({
        nome,
        artista,
        categoria: categoriaId,
        ficheiro: ficheiroNome,
        imagem: imagemNome,
        status: "pendente",
      });

      await musica.save();
      res.status(200).json({ message: "Música publicada com sucesso!", musica });
    } catch (error) {
      res.status(500).json({ error: "Erro ao adicionar música. Tente novamente." });
    }
  }
);

router.get("/getMusicasPendentes", async (req, res) => {
  try {
    const musicasPendentes = await Musicas.find({ status: "pendente" });
    res.status(200).json(musicasPendentes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter músicas pendentes" });
  }
});

router.get("/musicas", async (req, res) => {
  try {
    const musicas = await Musicas.find();
    res.status(200).json(musicas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar músicas." });
  }
});

router.get("/musicas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const musica = await Musicas.findById(id);

    if (!musica) {
      return res.status(404).json({ error: "Música não encontrada." });
    }

    res.status(200).json(musica);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar música." });
  }
});

router.patch("/aprovarMusica/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const musica = await Musicas.findById(id);

    if (!musica) {
      return res.status(404).send({ error: "Música não encontrada" });
    }

    musica.status = "aprovado";
    await musica.save();
    res.status(200).send({ message: "Música aprovada com sucesso", musica });
  } catch (error) {
    res.status(500).send({ error: "Erro ao aprovar música" });
  }
});

router.delete("/rejeitarMusica/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const musica = await Musicas.findById(id);
    if (!musica) {
      return res.status(404).send({ error: "Música não encontrada" });
    }

    await Musicas.findByIdAndDelete(id);
    res.status(200).send({ message: "Música removida com sucesso" });
  } catch (error) {
    res.status(500).send({ error: "Erro ao remover a música" });
  }
});

router.delete("/musicas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const musica = await Musicas.findById(id);
    if (!musica) {
      return res.status(404).send({ error: "Música não encontrada" });
    }

    await Musicas.findByIdAndDelete(id);
    res.status(200).send({ message: "Música removida com sucesso" });
  } catch (error) {
    res.status(500).send({ error: "Erro ao remover a música" });
  }
});

module.exports = router;