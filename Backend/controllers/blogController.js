const fs = require("fs");
const path = require("path");
const blogModel = require("../models/blogModel");

const toPublicBlog = (blog) => {
  if (!blog) return blog;
  return {
    id: blog.id,
    title: blog.title,
    category: blog.category,
    description: blog.description,
    content: blog.content,
    image: blog.image,
    views: blog.views,
    createdAt: blog.created_at,
    updatedAt: blog.updated_at,
    author: {
      id: blog.author_id,
      fullName: blog.author_name,
    },
  };
};

const getAllBlogs = async (req, res) => {
  try {
    const { category, search } = req.query;
    const blogs = await blogModel.getAllBlogs({ category, search });
    res.status(200).json({ blogs: blogs.map(toPublicBlog) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

const getMyBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.getBlogsByAuthor(req.user.id);
    const stats = await blogModel.countBlogsByAuthor(req.user.id);
    res.status(200).json({
      blogs: blogs.map(toPublicBlog),
      stats: { totalBlogs: stats.total, totalViews: stats.totalViews },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch your blogs" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await blogModel.getBlogById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    await blogModel.incrementViews(req.params.id);
    res.status(200).json({ blog: toPublicBlog(blog) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, category, description, content } = req.body;

    if (!title || !category || !content) {
      return res
        .status(400)
        .json({ message: "Title, category and content are required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const blog = await blogModel.createBlog({
      title,
      category,
      description: description || content.slice(0, 150),
      content,
      image,
      authorId: req.user.id,
    });

    res.status(201).json({ message: "Blog created", blog: toPublicBlog(blog) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create blog" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const existing = await blogModel.getBlogById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (existing.author_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this blog" });
    }

    const { title, category, description, content } = req.body;
    let image = null;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      // remove old image file if it exists locally
      if (existing.image) {
        const oldPath = path.join(__dirname, "..", existing.image);
        fs.unlink(oldPath, () => {});
      }
    }

    const blog = await blogModel.updateBlog(req.params.id, {
      title: title || existing.title,
      category: category || existing.category,
      description: description || existing.description,
      content: content || existing.content,
      image,
    });

    res.status(200).json({ message: "Blog updated", blog: toPublicBlog(blog) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update blog" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const existing = await blogModel.getBlogById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (existing.author_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blogModel.deleteBlog(req.params.id);

    if (existing.image) {
      const imgPath = path.join(__dirname, "..", existing.image);
      fs.unlink(imgPath, () => {});
    }

    res.status(200).json({ message: "Blog deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete blog" });
  }
};

const getGlobalStats = async (req, res) => {
  try {
    const stats = await blogModel.getGlobalStats();
    res.status(200).json({ stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch global stats" });
  }
};

module.exports = {
  getAllBlogs,
  getMyBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getGlobalStats,
};
