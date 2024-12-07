const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    descricao: {
        type: String,
        maxlength: 255,
        trim: true
    },
    musicas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'musicas'
    }],
    utilizador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'utilizadores',
        required: true
    },
}, {
    timestamps: true
});

PlaylistSchema.index({ nome: 1, utilizador: 1 }, { unique: true });

PlaylistSchema.pre('save', function (next) {
    console.log(`Playlist "${this.nome}" criada/modificada pelo usuário ${this.utilizador}`);
    next();
});

const Playlist = mongoose.model('playlists', PlaylistSchema);

module.exports = Playlist;
