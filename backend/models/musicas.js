const mongoose = require('mongoose');

const MusicasSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
    ficheiro: { 
        type: String, 
        required: true,
        validate: {
            validator: function(value) {
                return value.endsWith('.wav'); 
            },
            message: props => `${props.value} is not a valid wav file!`
        }
    },
    artista: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true
});

const Musicas = mongoose.model('musicas', MusicasSchema);

module.exports = Musicas;
