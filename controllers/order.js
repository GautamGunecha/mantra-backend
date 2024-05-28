const _ = require("lodash");

const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const ApplicationError = require("../middlewares/applicationError");
const responder = require("../utilities/responder");
const {
  validateAppliedCouponCode,
  validateCartItems,
} = require("../utilities/helpers/order");
const createPaymentRequest = require("../services/payments");

const create = async (req, res, next) => {
  try {
    const { ACTIVE_USER, body } = req;
    const { cartId } = body;

    if (_.isEmpty(cartId))
      throw new ApplicationError(
        "Required cart info to proceed to checkout.",
        400
      );

    const userCart = await Cart.findOne({ _id: cartId }).lean();
    if (_.isEmpty(userCart))
      throw new ApplicationError("Invalid cart info", 400);

    const { totalCartValue, couponApplied } = userCart;
    if (_.isEqual(totalCartValue, 0))
      throw new ApplicationError("Cannot proceed to checkout cart", 400);

    if (!_.isEmpty(couponApplied)) await validateAppliedCouponCode(userCart);
    await validateCartItems(userCart);

    // generate payment info
    const paymentConfig = {
      provider: "instamojo",
      balance: totalCartValue,
      purpose: "purchase",
    };

    const response = await createPaymentRequest(paymentConfig, ACTIVE_USER);
    const { paymentUrl } = response;

    await Promise.all([
      req.session.commitTransaction(),
      req.session.endSession(),
    ]);

    res
      .status(200)
      .send(responder("payment link", { paymentLink: paymentUrl }));
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

module.exports = { create };
