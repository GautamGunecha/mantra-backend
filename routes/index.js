const router = require("express").Router();

const {
  register,
  validateUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { auth, isAdmin, isVendor } = require("../middlewares/authentication");
const { update: updateProfile } = require("../controllers/profile");
const {
  create: createRole,
  deleteRole,
  get: getRole,
  update: updateRole,
} = require("../controllers/role");
const { create: createSweetUserRole } = require("../controllers/sweetUserRole");
const { create: createProduct } = require("../controllers/product");
const { get: getBrands } = require("../controllers/brand");

// =========================== open api's ===========================

// auth api
router.route("/auth/register").post(register);
router.route("/auth/validate/user").post(validateUser);
router.route("/auth/login").post(login);
router.route("/auth/logout").post(logout);
router.route("/auth/forgot/password").post(forgotPassword);
router.route("/auth/reset/password").post(resetPassword);

// brand api
router.route("/brands").get(getBrands);

// =========================== required authentication ===========================

// profile routes
router.route("/profile").put(auth, updateProfile);

// =========================== admin access only api's ===========================

// role
router.route("/role").post(isAdmin, createRole);
router.route("/role").get(isAdmin, getRole);
router.route("/role").get(isAdmin, updateRole);
router.route("/role").delete(isAdmin, deleteRole);

// role
router.route("/sweetuserrole").post(isAdmin, createSweetUserRole);

// =========================== vendor access only api's ===========================

// product routes
router.route("/product").post(isVendor, createProduct);

module.exports = router;
