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
  const pagination = req.query.pagination
    ? parseInt(req.query.pagination)
    : 100;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  try {
    const count = await Role.countDocuments();
    const pages = pagination > 0 ? Math.ceil(count / pagination) || 1 : null;
    const hasNextPage = page < pages ? true : false;
    const hasPreviousPage = page > 1 ? true : false;
    const nextPage = hasNextPage ? page + 1 : null;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const roles = await Role
      .find()
      .skip((page - 1) * pagination)
      .limit(pagination)
      .lean();
    return res.status(200).json({
      roles: roles,
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
