const express = require("express");
const router = express.Router();
const { toggleLike, getLikeStatus } = require("../controllers/likeController");
const { protect, optionalProtect } = require("../middleware/authMiddleware");

router.post("/blogs/:blogId", protect, toggleLike);
router.get("/blogs/:blogId", optionalProtect, getLikeStatus);

module.exports = router;
