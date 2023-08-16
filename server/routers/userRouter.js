const {
  followOrUnfollowUserController,
  getPostsOfFollowing,
  getMyPosts,
  getUserPosts,
  deleteMyProfile,
  getMyInfo,
  upadateUserProfile,
  getUserProfile,
} = require("../controllers/userController");
const requireUser = require("../middlewares/requireUser");

const router = require("express").Router();

router.post("/follow", requireUser, followOrUnfollowUserController);
router.get("/getFeedData", requireUser, getPostsOfFollowing);
router.get("/getMyPosts", requireUser, getMyPosts);
router.get("/getUserPosts", requireUser, getUserPosts);
router.delete("/", requireUser, deleteMyProfile);
router.get("/getMyInfo", requireUser, getMyInfo);
router.put("/", requireUser, upadateUserProfile);
router.post("/getUserProfile", requireUser, getUserProfile);

module.exports = router;
