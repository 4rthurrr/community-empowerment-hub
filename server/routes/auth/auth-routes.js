const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  changePassword
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;
