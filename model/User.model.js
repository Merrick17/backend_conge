//importation de la variable mongoose dans notre bibo
const mongoose = require('mongoose'); 
//on crée un model par exemple user cad ceartion de table user en mongoodb atraver les shema suivant 
const UserModal = new mongoose.Schema({
'name': String, 
'firstName':String, 
'email':String, 
'password':String, 
'phone':Number,
'role':{type:mongoose.Schema.Types.ObjectId,ref:'Role'},
'soldeConge':Number


}); 

module.exports =mongoose.model('User',UserModal); 
