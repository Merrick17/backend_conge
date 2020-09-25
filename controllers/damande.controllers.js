const demande = require("../model/demande.model");
const config = require("../config/configuration");
const User = require("../model/User.model");
module.exports.ademande = async (req, res) => {
  let dateDebut = new Date(req.body.date_depart);
  let dateFin = new Date(req.body.date_retour);
  let datej = dateFin.getTime() - dateDebut.getTime();
  let min = 1000 * 60 * 60 * 24;
  let nbrjrs = datej / min;
  console.log(dateFin);
  let newdemande = new demande({
    name: req.body.name,
    comment: req.body.comment,
    salarier: req.body.salarier,

    date_depart: dateDebut,
    date_retour: dateFin,
    nbrJrs: nbrjrs,
    status: 0, // 0 signifie que la demande est encours d'execution
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
  const pagination = req.query.pagination
    ? parseInt(req.query.pagination)
    : 100;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  try {
    const count = await demande.countDocuments();
    const pages = pagination > 0 ? Math.ceil(count / pagination) || 1 : null;
    const hasNextPage = page < pages ? true : false;
    const hasPreviousPage = page > 1 ? true : false;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const demandes = await demande
      .find()
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("salarier", ["name", "firstName"])
      .lean();
    return res.status(200).json({
      demandes: demandes,
      paginationData: {
        count: count,
        nextPage: nextPage,
        previousPage: previousPage,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage,
        pages: pages,
        page: page,
      },
    });
  } catch (err) {
    return res.status(500).json({ err_message: err });
  }
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
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 100;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    try {
      const count = await demande.countDocuments({
        salarier: req.params.salarierid,
      });
      const pages = pagination > 0 ? Math.ceil(count / pagination) || 1 : null;
      const hasNextPage = page < pages ? true : false;
      const hasPreviousPage = page > 1 ? true : false;
      const nextPage = hasNextPage ? page + 1 : null;
      const previousPage = hasPreviousPage ? page - 1 : null;
      const demandes = await demande
        .find()
        .skip((page - 1) * pagination)
        .limit(pagination)
        .populate("salarier", ["name", "firstName"])
        .lean();
      return res.status(200).json({
        demandes: demandes,
        paginationData: {
          count: count,
          nextPage: nextPage,
          previousPage: previousPage,
          hasNextPage: hasNextPage,
          hasPreviousPage: hasPreviousPage,
          pages: pages,
          page: page,
        },
      });
    } catch (err) {
      return res.status(500).json({ err_message: err });
    }
};

module.exports.changerEtatDemande = async (req, res) => {
  try {
    let result = await demande.findByIdAndUpdate(req.params.id, {
      status: req.body.newstatus,
    });
    if (result.status == 1) {
      //recuperer les salarier byId
      let user = await User.findById(result.salarier);
      let newSolde = user.soldeConge - result.nbrJrs;
      //finalesult cette function return une modification de solde conger dun salairier
      let finalResult = await User.findByIdAndUpdate(result.salarier, {
        soldeConge: newSolde,
      });
      console.log(finalResult);
    }

    res.json({
      error: false,
      message: "updated",
    });
  } catch (error) {
    res.json({
      error: true,
      message: error,
    });
  }
};
