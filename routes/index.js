const router = require("express").Router();

const {
  register,
  validateUser,
  login,
  logout,
} = require("../controllers/auth");

// auth api
router.route("/auth/register").post(register);
router.route("/auth/validate/user").post(validateUser);
router.route("/auth/login").post(login);
router.route("/auth/logout").post(logout);

module.exports = router;
