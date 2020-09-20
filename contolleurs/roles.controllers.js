const Role = require("../model/roles.model");

module.exports.addRole = async (req, res) => {
  let newRole = new Role({
    role: req.body.name,
  });
  let result = await newRole.save();
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

module.exports.getAllRoles = async (req, res) => {
  try {
    let result = await Role.find();

    res.json({
      message: result,
      error: false,
    });
  } catch (error) {
    res.json({
      message: error,
      error: true,
    });
  }
};
