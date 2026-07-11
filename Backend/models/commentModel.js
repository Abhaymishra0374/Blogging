const db = require("../config/db");

const createComment = async ({ blogId, userId, content }) => {
  const sql = "INSERT INTO comments (blog_id, user_id, content) VALUES (?, ?, ?)";
  const [result] = await db.query(sql, [blogId, userId, content]);
  return getCommentById(result.insertId);
};

const getCommentsByBlogId = async (blogId) => {
  const sql = `
    SELECT 
      comments.id, 
      comments.content, 
      comments.blog_id, 
      comments.created_at,
      users.id AS user_id, 
      users.full_name AS user_name, 
      users.avatar AS user_avatar
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE comments.blog_id = ?
    ORDER BY comments.created_at DESC
  `;
  const [rows] = await db.query(sql, [blogId]);
  return rows;
};

const getCommentById = async (id) => {
  const sql = `
    SELECT 
      comments.id, 
      comments.content, 
      comments.blog_id, 
      comments.created_at,
      users.id AS user_id, 
      users.full_name AS user_name, 
      users.avatar AS user_avatar
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE comments.id = ?
  `;
  const [rows] = await db.query(sql, [id]);
  return rows[0] || null;
};

const deleteComment = async (id) => {
  await db.query("DELETE FROM comments WHERE id = ?", [id]);
};

module.exports = {
  createComment,
  getCommentsByBlogId,
  getCommentById,
  deleteComment,
};
