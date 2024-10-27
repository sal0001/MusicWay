const Musicas = require('./musicas');

const addMusic = async (musicData) => {
    console.log('Dados recebidos para adicionar música:', musicData);

    const newMusic = {
        nome: musicData.nome,  
        ficheiro: musicData.ficheiro, 
        artista: musicData.artista 
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