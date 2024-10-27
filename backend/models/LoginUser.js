const Utilizadores = require('./utilizadores'); 
const bcrypt = require('bcrypt'); 

const loginUser = async (email, password) => {
    const user = await Utilizadores.findOne({ email }); 

    if (!user) {
        throw new Error('Usuário não encontrado'); 
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Senha incorreta'); 
    }

    return user; 
};

module.exports = loginUser;
