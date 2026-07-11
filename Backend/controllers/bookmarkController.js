const bookmarkModel = require("../models/bookmarkModel");
const blogModel = require("../models/blogModel");

const toggleBookmark = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const blog = await blogModel.getBlogById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { bookmarked } = await bookmarkModel.getBookmarkStatus(blogId, userId);

    if (bookmarked) {
      await bookmarkModel.unbookmarkBlog(blogId, userId);
      return res.status(200).json({ message: "Bookmark removed", bookmarked: false });
    } else {
      await bookmarkModel.bookmarkBlog(blogId, userId);
      return res.status(200).json({ message: "Blog bookmarked", bookmarked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle bookmark" });
  }
};

const getBookmarkStatus = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;
    const status = await bookmarkModel.getBookmarkStatus(blogId, userId);
    res.status(200).json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookmark status" });
  }
};

const getMyBookmarkedBlogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogs = await bookmarkModel.getBookmarkedBlogs(userId);
    
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

    res.status(200).json({ blogs: blogs.map(toPublicBlog) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookmarked blogs" });
  }
};

module.exports = {
  toggleBookmark,
  getBookmarkStatus,
  getMyBookmarkedBlogs,
};
