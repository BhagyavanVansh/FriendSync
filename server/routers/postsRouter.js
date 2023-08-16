const {
  createPostController,
  likeAndUnlikePost,
  updatePostController,
  deletePostController,
} = require("../controllers/postsController");
const requireUser = require("../middlewares/requireUser");

const router = require("express").Router();

router.post("/", requireUser, createPostController);
router.post("/like", requireUser, likeAndUnlikePost);
router.put("/", requireUser, updatePostController);
router.delete("/", requireUser, deletePostController);

module.exports = router;
