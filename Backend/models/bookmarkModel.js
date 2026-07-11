const db = require("../config/db");

const bookmarkBlog = async (blogId, userId) => {
  const sql = "INSERT IGNORE INTO bookmarks (blog_id, user_id) VALUES (?, ?)";
  const [result] = await db.query(sql, [blogId, userId]);
  return result.affectedRows > 0;
};

const unbookmarkBlog = async (blogId, userId) => {
  const sql = "DELETE FROM bookmarks WHERE blog_id = ? AND user_id = ?";
  const [result] = await db.query(sql, [blogId, userId]);
  return result.affectedRows > 0;
};

const getBookmarkStatus = async (blogId, userId) => {
  if (!userId) return { bookmarked: false };
  const [rows] = await db.query("SELECT 1 FROM bookmarks WHERE blog_id = ? AND user_id = ?", [blogId, userId]);
  return { bookmarked: rows.length > 0 };
};

const getBookmarkedBlogs = async (userId) => {
  const sql = `
    SELECT 
      blogs.id, blogs.title, blogs.category, blogs.description, blogs.content,
      blogs.image, blogs.views, blogs.created_at, blogs.updated_at,
      users.id AS author_id, users.full_name AS author_name
    FROM bookmarks
    JOIN blogs ON blogs.id = bookmarks.blog_id
    JOIN users ON users.id = blogs.author_id
    WHERE bookmarks.user_id = ?
    ORDER BY bookmarks.created_at DESC
  `;
  const [rows] = await db.query(sql, [userId]);
  return rows;
};

module.exports = {
  bookmarkBlog,
  unbookmarkBlog,
  getBookmarkStatus,
  getBookmarkedBlogs,
};
