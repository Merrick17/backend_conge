const mongoose = require('mongoose'); 
const mongoosePaginate = require("mongoose-paginate");
const RoleModal = new mongoose.Schema({

    'role':String
}); 
RoleModal.plugin(mongoosePaginate)
module.exports = mongoose.model('Role',RoleModal); 