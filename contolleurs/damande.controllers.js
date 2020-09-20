const demande = require("../model/demande.model");
const config = require("../config/configuration");
const User = require('../model/User.model'); 
module.exports.ademande = async (req, res) => {
  let dateDebut = new Date(req.body.date_depart); 
  let dateFin = new Date(req.body.date_retour); 
  let datej=(dateFin.getTime()-dateDebut.getTime());
  let min=1000 * 60 * 60 *24;
  let nbrjrs = (datej/min);
  console.log(dateFin); 
  let newdemande = new demande({
    name: req.body.name,
    comment: req.body.comment,
    salarier: req.body.salarier,
   
    date_depart: dateDebut,
    date_retour: dateFin,
    nbrJrs:nbrjrs,
    status:0 // 0 signifie que la demande est encours d'execution

  });
  let result = await newdemande.save();
  if (result) {
    res.json({
      message: result,
      error: false,
    });
  } else {
    res.json({
      message: "Erreur est servenu",
      error: true,
    });
  }
};

module.exports.getAll = async (req, res) => {
  let result = await demande
    .find()
    .populate("salarier", ["name", "firstName"]) ; 
    // .populate("supadmin", ["name", "firstName"]);

  res.json({
    error: false,
    message: result,
  });
};

module.exports.deleteDemande = async (req, res) => {
  try {
    await demande.findByIdAndDelete(req.params.id);

    res.json({
      message: "success",
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
};
module.exports.getDemandeBySalarier = async (req, res) => {
  console.log(req.params.salarierid);
  try {
    let demandes = await demande.find({
      salarier: req.params.salarierid,
    }).populate("salarier", ["name", "firstName"]);
    console.log(demandes);
    res.json({
      error: false,
      demandes: demandes,
    });
  } catch (error) {
    res.json({
      error: true,
      message: error,
    });
  }
};

module.exports.changerEtatDemande = async (req,res)=>{
  try {
    let result = await demande.findByIdAndUpdate(req.params.id,{
      status:req.body.newstatus 
    }); 
    if(result.status==1)
    {//recuperer les salarier byId
        let user= await User.findById(result.salarier); 
        let newSolde = user.soldeConge-result.nbrJrs ; 
        //finalesult cette function return une modification de solde conger dun salairier 
        let finalResult =await User.findByIdAndUpdate(result.salarier,{
          soldeConge:newSolde
        }); 
        console.log(finalResult); 

    }

    res.json({
      'error':false,
      'message':'updated'
    })
    
  } catch (error) {
    res.json({
      'error':true,
      'message':error
    })
  }
}

