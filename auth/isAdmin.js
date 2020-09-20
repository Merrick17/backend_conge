const Role = require("../model/roles.model");

const Admin = async (req, res, next) => {
  let role = req.headers["role"];
  if (!role) {
    res.json({ message: "Vous etes pas autorisé" });
  } else {
    let selectedRole = await Role.findById(role);
    if (
        //toLowerCase retourne la chaîne de caractères courante en minuscules.
      selectedRole.role.toLowerCase().trim() !=
      "Admin".toLowerCase().trim()// trim permet de retirer
    ) {
      res.json({ message: "Vous etes pas autorisé" });
    } else {
      next();
    }
  }
};

module.exports = Admin;
