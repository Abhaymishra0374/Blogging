const likeModel = require("../models/likeModel");
const blogModel = require("../models/blogModel");

const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;

    const blog = await blogModel.getBlogById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { liked } = await likeModel.getLikeStatus(blogId, userId);

    if (liked) {
      await likeModel.unlikeBlog(blogId, userId);
      const updatedStatus = await likeModel.getLikeStatus(blogId, userId);
      return res.status(200).json({ message: "Blog unliked", liked: false, count: updatedStatus.count });
    } else {
      await likeModel.likeBlog(blogId, userId);
      const updatedStatus = await likeModel.getLikeStatus(blogId, userId);
      return res.status(200).json({ message: "Blog liked", liked: true, count: updatedStatus.count });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle like" });
  }
};

const getLikeStatus = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.id || null;
    const status = await likeModel.getLikeStatus(blogId, userId);
    res.status(200).json(status);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch like status" });
  }
};

module.exports = {
  toggleLike,
  getLikeStatus,
};
