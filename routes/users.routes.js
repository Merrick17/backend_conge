const express = require("express");
const UserController = require("../controllers/users.controllers");
const verifToken=require("../auth/verifToken");
//declaration de la route 
const isAdmin = require("../auth/isAdmin");
const router = express.Router(); 

router.post("/add",UserController.ajouterUser);
router.post("/login" , UserController.loginUser);
router.get("/allusers", UserController.gettAllUser);
router.get("/:_id", UserController.getUserByID);
router.put("/:id",verifToken,UserController.updateUser);
router.delete("/:id", verifToken,UserController.deleteUser);

module.exports = router; 
