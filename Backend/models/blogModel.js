const db = require("../config/db");

const BASE_SELECT = `
  SELECT
    blogs.id, blogs.title, blogs.category, blogs.description, blogs.content,
    blogs.image, blogs.views, blogs.created_at, blogs.updated_at,
    users.id AS author_id, users.full_name AS author_name
  FROM blogs
  JOIN users ON users.id = blogs.author_id
`;

// Get all blogs, optionally filtered by category and/or a search term.
const getAllBlogs = async ({ category, search } = {}) => {
  let sql = BASE_SELECT;
  const conditions = [];
  const params = [];

  if (category && category !== "All") {
    conditions.push("blogs.category = ?");
    params.push(category);
  }

  if (search) {
    conditions.push("(blogs.title LIKE ? OR blogs.description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY blogs.created_at DESC";

  const [rows] = await db.query(sql, params);
  return rows;
};

const getBlogsByAuthor = async (authorId) => {
  const [rows] = await db.query(
    `${BASE_SELECT} WHERE blogs.author_id = ? ORDER BY blogs.created_at DESC`,
    [authorId]
  );
  return rows;
};

const getBlogById = async (id) => {
  const [rows] = await db.query(`${BASE_SELECT} WHERE blogs.id = ?`, [id]);
  return rows[0] || null;
};

const createBlog = async ({
  title,
  category,
  description,
  content,
  image,
  authorId,
}) => {
  const sql = `INSERT INTO blogs (title, category, description, content, image, author_id)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const [result] = await db.query(sql, [
    title,
    category,
    description,
    content,
    image,
    authorId,
  ]);
  return getBlogById(result.insertId);
};

const updateBlog = async (id, { title, category, description, content, image }) => {
  const fields = [];
  const params = [];

  fields.push("title = ?");
  params.push(title);
  fields.push("category = ?");
  params.push(category);
  fields.push("description = ?");
  params.push(description);
  fields.push("content = ?");
  params.push(content);

  if (image) {
    fields.push("image = ?");
    params.push(image);
  }

  params.push(id);

  await db.query(`UPDATE blogs SET ${fields.join(", ")} WHERE id = ?`, params);
  return getBlogById(id);
};

const deleteBlog = async (id) => {
  await db.query("DELETE FROM blogs WHERE id = ?", [id]);
};

const incrementViews = async (id) => {
  await db.query("UPDATE blogs SET views = views + 1 WHERE id = ?", [id]);
};

const countBlogsByAuthor = async (authorId) => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total, COALESCE(SUM(views),0) AS totalViews FROM blogs WHERE author_id = ?",
    [authorId]
  );
  return rows[0];
};

module.exports = {
  getAllBlogs,
  getBlogsByAuthor,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  incrementViews,
  countBlogsByAuthor,
};
