const Playlist = require('./playlists'); 

const addPlaylist = async (playlistData) => {
    console.log('Dados recebidos para adicionar playlist:', playlistData);

    const newPlaylist = {
        nome: playlistData.nome,
        utilizador: playlistData.utilizador,
        musicas: playlistData.musicas || [],
    };

    try {
        const result = await Playlist.create(newPlaylist);
        console.log('Playlist adicionada:', result);
        return result;
    } catch (error) {
        console.error('Erro ao adicionar playlist:', error);
        throw error;
    }
};

module.exports = addPlaylist;