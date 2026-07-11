const commentModel = require("../models/commentModel");
const blogModel = require("../models/blogModel");

const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const blog = await blogModel.getBlogById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = await commentModel.createComment({
      blogId,
      userId: req.user.id,
      content,
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await commentModel.getCommentsByBlogId(blogId);
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

const removeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await commentModel.getCommentById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const blog = await blogModel.getBlogById(comment.blog_id);
    const isCommentAuthor = comment.user_id === req.user.id;
    const isBlogAuthor = blog && blog.author_id === req.user.id;

    if (!isCommentAuthor && !isBlogAuthor) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await commentModel.deleteComment(id);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

module.exports = {
  addComment,
  getComments,
  removeComment,
};
