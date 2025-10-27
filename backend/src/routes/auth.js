const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utilizadores = require("../../models/utilizadores");
const Roles = require("../../models/Roles");
const verifyToken = require("../config/middlewares/auth.js");

const router = express.Router();

router.get("/auth", verifyToken, (req, res) => {
  const user = {
    userId: req.user.userId,
    nome: req.user.nome,
    email: req.user.email,
  };
  res.status(200).json({ authenticated: true, user });
});

router.put("/auth/editar-perfil", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nome, email, password } = req.body;

    if (!nome && !email && !password) {
      return res.status(400).json({
        error: "Pelo menos um campo deve ser fornecido para atualização.",
      });
    }

    const user = await Utilizadores.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado." });
    }

    if (nome) user.nome = nome;
    if (email) {
      const existingUser = await Utilizadores.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: "Email já está em uso." });
      }
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: "Perfil atualizado com sucesso.", user });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar perfil: " + err.message });
  }
});

router.post("/home/registar", async (req, res) => {
  const { nome, email, password } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const existingUser = await Utilizadores.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let role = await Roles.findOne({ nome: "utilizador" });
    if (!role) {
      role = new Roles({ nome: "utilizador" });
      await role.save();
    }

    const user = new Utilizadores({
      nome,
      email,
      password: hashedPassword,
      role: role._id,
    });

    await user.save();
    res.status(201).json({ message: "Utilizador registrado com sucesso.", user });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar utilizador: " + err.message });
  }
});

router.post("/home/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  try {
    const user = await Utilizadores.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email ou senha incorretos." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email ou senha incorretos." });
    }

    const token = jwt.sign(
      { userId: user._id, nome: user.nome, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "365d" }
    );

    res.json({
      message: "Login realizado com sucesso.",
      token,
      user: { nome: user.nome, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no servidor. Tente novamente mais tarde." });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.status(200).json({ message: "Logout bem-sucedido." });
});

module.exports = router;