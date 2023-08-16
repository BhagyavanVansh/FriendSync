const {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/refresh", refreshAccessTokenController);

module.exports = router;
