
## Required 
- NodeJS(last version)
- MongoDB 1.45.6 


## Setup DataBase

use musicway;


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
  { nome: "" },
]);

db.roles.insertMany([
  { nome: "Admin" },
  { nome: "User" }
]);

const roleAdmin = db.roles.findOne({ nome: "Admin" });

db.utilizadores.insertMany([
   { nome: "admin", email: "", password: "", role: roleAdmin._id },
]);

db.musicas.insertMany([
  { nome: "", artista: "", categoria: ObjectId(""), ficheiro: "", status: "" },
  { nome: "", artista: "", categoria: ObjectId(""), ficheiro: "", status: "" }
]);

db.playlists.insertMany([
  { nome: "", descricao: "", utilizador: ObjectId(""), imagem: "" },
  { nome: "", descricao: "", utilizador: ObjectId(""), imagem: "" }
]);


