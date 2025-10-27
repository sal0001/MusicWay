const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/M&B", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a base de dados.");
  } catch (err) {
    console.error("Erro a conectar a base de dados:", err);
    process.exit(1);
  }
};

module.exports = connectDB;