const mongoose = require('mongoose'); 

const RoleModal = new mongoose.Schema({

    'role':String
}); 

module.exports = mongoose.model('Role',RoleModal); 