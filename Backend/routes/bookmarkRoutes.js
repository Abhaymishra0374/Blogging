const express = require("express");
const router = express.Router();
const { toggleBookmark, getBookmarkStatus, getMyBookmarkedBlogs } = require("../controllers/bookmarkController");
const { protect } = require("../middleware/authMiddleware");

router.post("/blogs/:blogId", protect, toggleBookmark);
router.get("/blogs/:blogId", protect, getBookmarkStatus);
router.get("/", protect, getMyBookmarkedBlogs);

module.exports = router;
