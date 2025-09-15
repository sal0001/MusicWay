
Required 
- NodeJS(last version)
- MongoDB 1.45.6 


Setup DataBase

use musicway;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

db.createCollection("categorias");
db.categorias.createIndex({ "nome": 1 }, { unique: true });

db.createCollection("musicas");
db.musicas.createIndex({ "categoria_id": 1 });

db.createCollection("playlists");
db.playlists.createIndex({ "utilizador_id": 1 });

db.createCollection("roles");
db.roles.createIndex({ "nome": 1 }, { unique: true });

db.createCollection("utilizadores");
db.utilizadores.createIndex({ "email": 1 }, { unique: true });
db.utilizadores.createIndex({ "role_id": 1 });

db.categorias.insertMany([
  { nome: "Pop" },
  { nome: "Rock" },
  { nome: "Jazz" }
]);

db.roles.insertMany([
  { nome: "Admin" },
  { nome: "User" }
]);

const roleAdmin = db.roles.findOne({ nome: "Admin" });

db.utilizadores.insertMany([
   { nome: "admin", email: "admin@gmail.com", password: "123", role: roleAdmin._id },
]);

db.musicas.insertMany([
  { nome: "Música 1", artista: "Artista 1", categoria: ObjectId("categoria_id_example_1"), ficheiro: "file_1.mp3", status: "pendente" },
  { nome: "Música 2", artista: "Artista 2", categoria: ObjectId("categoria_id_example_2"), ficheiro: "file_2.mp3", status: "aprovado" }
]);

db.playlists.insertMany([
  { nome: "Playlist 1", descricao: "Minha playlist favorita", utilizador: ObjectId("utilizador_id_example_1"), imagem: "image_1.jpg" },
  { nome: "Playlist 2", descricao: "Playlist para relaxar", utilizador: ObjectId("utilizador_id_example_2"), imagem: "image_2.jpg" }
]);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
