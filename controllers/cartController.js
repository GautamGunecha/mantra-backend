const _ = require("lodash");

const Cart = require("../models/cart");
const Product = require("../models/product");

const ApplicationError = require("../middlewares/applicationError");
const responder = require("../utilities/responder");
const Coupon = require("../models/coupon");

const create = async (req, res, next) => {
  try {
    const { ACTIVE_USER, body } = req;
    const { items } = body;

    const { couponCode } = body;
    const { product, quantity, price, total } = items;

    let userCart;

    userCart = await Cart.findOne({ user: ACTIVE_USER._id });
    if (_.isEmpty(userCart)) {
      userCart = await Cart.create({ user: ACTIVE_USER._id });
    }

    const coupon = await Coupon.findOne({}).lean();

    await Promise.all([
      req.session.commitTransaction(),
      req.session.endSession(),
    ]);

    res
      .status(201)
      .send(
        responder("product added to cart successfully.", { cart: userCart })
      );
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

const get = async (req, res, next) => {};

const deleteCartProduct = async (req, res, next) => {};

module.exports = { create, get, deleteCartProduct };
