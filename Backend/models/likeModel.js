const db = require("../config/db");

const likeBlog = async (blogId, userId) => {
  const sql = "INSERT IGNORE INTO likes (blog_id, user_id) VALUES (?, ?)";
  const [result] = await db.query(sql, [blogId, userId]);
  return result.affectedRows > 0;
};

const unlikeBlog = async (blogId, userId) => {
  const sql = "DELETE FROM likes WHERE blog_id = ? AND user_id = ?";
  const [result] = await db.query(sql, [blogId, userId]);
  return result.affectedRows > 0;
};

const getLikeStatus = async (blogId, userId) => {
  const [countRows] = await db.query("SELECT COUNT(*) AS count FROM likes WHERE blog_id = ?", [blogId]);
  const count = countRows[0]?.count || 0;

  let liked = false;
  if (userId) {
    const [rows] = await db.query("SELECT 1 FROM likes WHERE blog_id = ? AND user_id = ?", [blogId, userId]);
    liked = rows.length > 0;
  }

  return { liked, count };
};

module.exports = {
  likeBlog,
  unlikeBlog,
  getLikeStatus,
};
