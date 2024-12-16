const mongoose = require('mongoose');

const RolesSchema = new mongoose.Schema({
    nome: { 
        type: String, 
        required: true 
    },
}, {
    timestamps: true
});

const Roles = mongoose.models.Roles || mongoose.model('Roles', RolesSchema);

module.exports = Roles;
