const db = require("../config/db");

// Create a new user. Returns the insertId.
const createUser = async ({ fullName, email, password }) => {
  const sql =
    "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
  const [result] = await db.query(sql, [fullName, email, password]);
  return result.insertId;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
};

const getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, full_name, email, bio, avatar, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

const updateUser = async (id, { fullName, bio }) => {
  await db.query(
    "UPDATE users SET full_name = ?, bio = ? WHERE id = ?",
    [fullName, bio, id]
  );
  return getUserById(id);
};

const setResetToken = async (email, token, expiresAt) => {
  await db.query(
    "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?",
    [token, expiresAt, email]
  );
};

const verifyResetToken = async (email, token) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expires > NOW()",
    [email, token]
  );
  return rows[0] || null;
};

const updatePasswordAndClearToken = async (email, hashedPassword) => {
  await db.query(
    "UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?",
    [hashedPassword, email]
  );
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  setResetToken,
  verifyResetToken,
  updatePasswordAndClearToken,
};
