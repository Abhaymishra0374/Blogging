const db = require("../config/db");

const getAllCategories = async () => {
  const [rows] = await db.query("SELECT * FROM categories ORDER BY name ASC");
  return rows;
};

module.exports = {
  getAllCategories,
};
