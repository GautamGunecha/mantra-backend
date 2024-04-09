const router = require("express").Router();

const { register, validateUser } = require("../controllers/auth");

// auth api
router.route("/auth/register").post(register);
router.route("/auth/validate/user").post(validateUser);

module.exports = router;
