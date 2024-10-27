const mongoose = require('mongoose');

const UtilizadoresSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true,
        validate: {
            validator: function(v) {
                return /.+@.+\..+/.test(v); 
            },
            message: props => `${props.value} não é um email válido!`
        }
    },
    password: { 
        type: String, 
        required: true 
    },
}, {
    timestamps: true
});

const Utilizadores = mongoose.model('utilizadores', UtilizadoresSchema);

module.exports = Utilizadores;