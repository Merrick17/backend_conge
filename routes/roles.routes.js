const express = require('express'); 
const RoleController = require("../controllers/roles.controllers"); 
const router = express.Router(); 

router.post('/addrole',RoleController.addRole); 
router.get('/',RoleController.getAllRoles); 




module.exports = router ; 