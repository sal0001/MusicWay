const express = require("express");
const Categoria = require("../../models/Categorias");

const router = express.Router();

router.post("/addCategoria", async (req, res) => {
  if (!req.body.nome) {
    return res.status(400).json({ error: "O nome da categoria é obrigatório." });
  }

  try {
    const novaCategoria = new Categoria({ nome: req.body.nome });
    const categoriaSalva = await novaCategoria.save();
    res.status(200).json({
      message: "Categoria adicionada com sucesso.",
      categoria: categoriaSalva,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar a categoria." });
  }
});

router.get("/getCategorias", async (req, res) => {
  try {
    const categorias = await Categoria.find();
    if (!categorias || categorias.length === 0) {
      return res.status(404).json({ error: "Nenhuma categoria encontrada." });
    }
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categorias." });
  }
});

router.delete("/removeCategoria/:categoriaId", async (req, res) => {
  try {
    const categoriaId = req.params.categoriaId;
    const result = await Categoria.findByIdAndDelete(categoriaId);
    if (!result) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }
    res.status(200).json({ message: "Categoria removida com sucesso." });
  } catch (err) {
    res.status(500).json({ message: "Erro ao remover a categoria." });
  }
});

module.exports = router;