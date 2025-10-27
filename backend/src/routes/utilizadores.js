const express = require("express");
const Utilizadores = require("../../models/utilizadores");

const router = express.Router();

router.get("/utilizadores", async (req, res) => {
  try {
    const utilizadores = await Utilizadores.find();
    res.status(200).json(utilizadores);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar utilizadores." });
  }
});

router.delete("/utilizadores/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await Utilizadores.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).json({ error: "Utilizador não encontrado." });
    }

    res.status(200).json({ message: "Utilizador removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover o utilizador." });
  }
});

router.get("/utilizadores/email", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "O email é obrigatório." });
  }

  try {
    const utilizador = await Utilizadores.findOne({ email });
    if (!utilizador) {
      return res.status(404).json({ error: "Utilizador não encontrado." });
    }

    res.status(200).json(utilizador);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar utilizador por email." });
  }
});

module.exports = router;