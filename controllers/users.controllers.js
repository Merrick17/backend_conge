//recuperer les model de user
const User = require("../model/User.model");
//const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");

const config = require("../config/configuration");
const mongoose = require("mongoose");
module.exports.ajouterUser = async (req, res) => {
  console.log("", req);
  let result = await User.findOne({
    // verifier si l'utilisateur existe a travere email
    email: req.body.email,
  });
  console.log("2", req);

  if (result) {
    res.json({
      message: "email existant ",
    });
  } else {
    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newUSer = new User({
      name: req.body.name,
      firstName: req.body.firstName,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      role: req.body.role,
      soldeConge: 20,
      imageUrl: gravatar.url(req.body.email),
    });
    let result = await newUSer.save();
    res.json({
      message: result,
    });
  }
};

module.exports.loginUser = async (req, res) => {
  const email = req.body.email; // recupération de la valeur email d'utilisateur
  const password = req.body.password;
  let result = await User.findOne({ email: email }).populate("role"); // recherche si l'utilisateur existe et l'affécté à la variable result
  if (result) {
    console.log("resuuult", result);

    let verif = await bcrypt.compare(password, result.password);
    console.log(verif);
    if (verif) {
      let token = jwt.sign({ id: result._id }, config.SECRET, {
        // generation du token de l'authentification
        expiresIn: 86400, // expires in 24 hours
      });
      res.json({
        auth: true,
        token: token,
        user: result,
      });
    } else {
      res.json({
        auth: false,
        message: " Email ou mot de passe incorrect",
      });
    }
  } else {
    res.json({
      auth: false,
      message: " Email ou mot de passe incorrect",
    });
  }
};

module.exports.gettAllUser = async (req, res) => {
  const pagination = req.query.pagination
    ? parseInt(req.query.pagination)
    : 100;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  try {
    const count = await User.countDocuments();
    const pages = pagination > 0 ? Math.ceil(count / pagination) || 1 : null;
    const hasNextPage = page < pages ? true : false;
    const hasPreviousPage = page > 1 ? true : false;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const users = await User.find()
      .skip((page - 1) * pagination)
      .limit(pagination)
      .populate("role", ["role"])
      .lean();
    return res.status(200).json({
      users: users,
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
module.exports.updateUser = async (req, res) => {
  try {
    const dataToUpdate = req.body;
    let { ...updateData } = dataToUpdate;

    let result = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json({
      message: "success Updat....",
    });
    console.log(result);
  } catch (error) {
    res.json({
      message: error,
    });
  }
};
module.exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "success",
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
};
module.exports.getUserByID = async (req, res) => {
  console.log(req.params._id);
  try {
    let result = await User.findById(req.params._id);

    //console.log(result);
    res.json({
      error: false,
      user: result,
    });
  } catch (error) {
    res.json({
      error: true,
      message: error,
    });
  }
};
