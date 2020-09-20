const express = require("express");
const DemandeController = require("../contolleurs/damande.controllers");

const router = express.Router(); 

router.post("/addemande", DemandeController.ademande);
router.get("/getdemande", DemandeController.getAll);
router.delete("/:id", DemandeController.deleteDemande);
router.get("/:salarierid", DemandeController.getDemandeBySalarier);
router.put('/updatedemande/:id',DemandeController.changerEtatDemande); 
module.exports = router; 
