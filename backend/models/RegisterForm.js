const bcrypt = require('bcrypt');
const Utilizadores = require('./utilizadores');

const registerUser = async (userData) => {
    
    const hashedPassword = await bcrypt.hash(userData.password, 10); 

    const newUser = {
        nome: userData.nome,  
        email: userData.email,
        password: hashedPassword 
    };

    return Utilizadores.create(newUser);
};

module.exports = registerUser;
