const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
    musicas: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'musicas' 
    }],
    utilizador: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'utilizadores', 
        required: true
    }
}, {
    timestamps: true 
});

const Playlist = mongoose.model('playlists', PlaylistSchema);

module.exports = Playlist;