const mongoose = require('mongoose'); 

const UserModal = new mongoose.Schema({
name: String, 
'salarier':{type:mongoose.Schema.Types.ObjectId,ref:'User'},
// 'supadmin':{type:mongoose.Schema.Types.ObjectId,ref:'User'}, // on a juste un seul admin donc c'est pas la peien de le refrencier
comment:String,
date_depart:{type: Date},
date_retour:{type: Date }, 
nbrJrs:Number,
status:Number



}); 

module.exports =mongoose.model('Demande',UserModal); 
