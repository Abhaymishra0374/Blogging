const express = require("express");
const router = express.Router();
const { addComment, getComments, removeComment } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

router.get("/blogs/:blogId", getComments);
router.post("/blogs/:blogId", protect, addComment);
router.delete("/:id", protect, removeComment);

module.exports = router;
