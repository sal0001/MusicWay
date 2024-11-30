const mongoose = require('mongoose');

const RolesSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
   
}, {
    timestamps: true
});

const Roles = mongoose.model('roles', RolesSchema);

module.exports = Roles;