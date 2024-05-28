const router = require("express").Router();

const {
  register,
  validateUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
  activeUser,
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
const { get: getBrands, create: createBrand } = require("../controllers/brand");
const {
  create: addAddress,
  update: updateAddress,
  deleteAddress,
  getAddress,
} = require("../controllers/address");

const { addMoney, checkBalance } = require("../controllers/wallet");
const { instamojoPaymentResponse } = require("../services/webhooks");
const paymentHandler = require("../middlewares/paymentsHandler");
const {
  create: addProductsToCart,
  deleteCartProduct,
  get: getCartDetails,
} = require("../controllers/cartController");
const {
  create: generateCoupon,
  get: getCoupon,
  update: updateCoupon,
} = require("../controllers/coupon");

const { create: createOrder } = require("../controllers/order");

// =========================== open api's ===========================

// auth api
router.route("/auth/register").post(register);
router.route("/auth/validate/user").post(validateUser);
router.route("/auth/login").post(login);
router.route("/auth/logout").post(logout);
router.route("/auth/forgot/password").post(forgotPassword);
router.route("/auth/reset/password").post(resetPassword);

// brand api
router.route("/brand").get(getBrands);

// coupon
router.route("/coupon").get(getCoupon);

// webhooks
router
  .route("/instamojo/response")
  .post(paymentHandler, instamojoPaymentResponse);

// =========================== required authentication ===========================

// get currently active user
router.route("/auth/active/user").get(auth, activeUser);

// profile routes
router.route("/profile").put(auth, updateProfile);

// address routes
router.route("/address").post(auth, addAddress);
router.route("/address").get(auth, getAddress);
router.route("/address").put(auth, updateAddress);
router.route("/address").delete(auth, deleteAddress);

// wallet access routes
router.route("/wallet/add").post(auth, addMoney);
router.route("/wallet/balance").get(auth, checkBalance);

// cart access routes
router.route("/cart").post(auth, addProductsToCart);
router.route("/cart").get(auth, getCartDetails);
router.route("/cart").delete(auth, deleteCartProduct);

// order
router.route("/order").post(auth, createOrder);

// =========================== admin access only api's ===========================

// role
router.route("/role").post(isAdmin, createRole);
router.route("/role").get(isAdmin, getRole);
router.route("/role").get(isAdmin, updateRole);
router.route("/role").delete(isAdmin, deleteRole);

// role
router.route("/sweetuserrole").post(isAdmin, createSweetUserRole);

// brand
router.route("/brand").post(isAdmin, createBrand);

// =========================== vendor access only api's ===========================

// product routes
router.route("/product").post(isVendor, createProduct);

// coupon routes
router.route("/coupon").post(isVendor, generateCoupon);
router.route("/coupon").put(isVendor, updateCoupon);

module.exports = router;
