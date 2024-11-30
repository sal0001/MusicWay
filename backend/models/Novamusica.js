const path = require('path'); 
const Musicas = require('./musicas');

const addMusic = async (musicData) => {
    console.log('Dados recebidos para adicionar música:', musicData);

    const { nome, ficheiro, artista, categoriaId } = musicData;

    if (!categoriaId) {
        throw new Error('Categoria é obrigatória para associar à música.');
    }

   
    const ficheiroNome = path.basename(ficheiro);  

    const newMusic = {
        nome: nome,
        ficheiro: ficheiroNome,  
        artista: artista,
        categoria: categoriaId
    };

    try {
        const result = await Musicas.create(newMusic);  
        console.log('Música adicionada:', result);
        return result;
    } catch (error) {
        console.error('Erro ao adicionar música:', error);
        throw error;
    }
};

module.exports = addMusic;