const router = require("express").Router();

const {
  register,
  validateUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { auth } = require("../middlewares/authentication");

// auth api
router.route("/auth/register").post(register);
router.route("/auth/validate/user").post(validateUser);
router.route("/auth/login").post(login);
router.route("/auth/logout").post(logout);
router.route("/auth/forgot/password").post(forgotPassword);
router.route("/auth/reset/password").post(resetPassword);

module.exports = router;
