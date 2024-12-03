const mongoose = require('mongoose');
const { Schema } = mongoose;

const MusicasSchema = new Schema({
    nome: { type: String, required: true },
    artista: { type: String, required: true },
    ficheiro: { type: String, required: true },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true,
    },
    status: {
        type: String,
        enum: ['pendente', 'aprovado'],
        default: 'pendente',
    },
}, { timestamps: true });

const Musicas = mongoose.model('Musicas', MusicasSchema);

module.exports = Musicas;