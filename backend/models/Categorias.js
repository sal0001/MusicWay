const mongoose = require('mongoose');

const CategoriasSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
   
}, {
    timestamps: true
});

const Categorias = mongoose.model('categorias', CategoriasSchema);

module.exports = Categorias;