const Playlist = require('./playlists');

const addPlaylist = async (playlistData) => {
    console.log('Dados recebidos para adicionar playlist:', playlistData);

    
    if (!playlistData.nome || !playlistData.utilizador) {
        throw new Error('Nome e Utilizador são obrigatórios para criar uma playlist.');
    }

   
    if (playlistData.musicas && !Array.isArray(playlistData.musicas)) {
        throw new Error('O campo "musicas" deve ser um array.');
    }


    const newPlaylist = {
        nome: playlistData.nome,
        descricao: playlistData.descricao || '', 
        utilizador: playlistData.utilizador,
        musicas: playlistData.musicas || [],  
        publica: playlistData.publica || false,
    };

    try {
        
        const result = await Playlist.create(newPlaylist);
        console.log('Playlist adicionada com sucesso:', result);
        return result; 
    } catch (error) {
       
        console.error('Erro ao adicionar a playlist:', error.message || error);
        throw new Error('Não foi possível adicionar a playlist. Verifique os dados e tente novamente.');
    }
};

module.exports = addPlaylist;