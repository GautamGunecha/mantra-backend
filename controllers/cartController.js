const _ = require("lodash");

const Cart = require("../models/cart");
const Product = require("../models/product");

const ApplicationError = require("../middlewares/applicationError");
const responder = require("../utilities/responder");
const Coupon = require("../models/coupon");
const { fromString } = require("uuidv4");

const create = async (req, res, next) => {
  try {
    const { ACTIVE_USER, body } = req;
    const { couponCode, productDetails } = body;
    const { productId, quantity = 1 } = productDetails;

    let userCart;

    userCart = await Cart.findOne({ user: ACTIVE_USER._id });
    if (_.isEmpty(userCart)) {
      userCart = await Cart.create({ user: ACTIVE_USER._id });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
    }).lean();
    if (!_.isEmpty(productId) && _.isEmpty(product))
      throw new ApplicationError(
        "Invalid product details or currently product is not available",
        400
      );

    const couponUuid = fromString(couponCode);
    const coupon = await Coupon.findOne({
      uuid: couponUuid,
      isValid: true,
      generatedBy: product.seller,
    }).lean();

    if (!_.isEmpty(couponCode) && _.isEmpty(coupon))
      throw new ApplicationError("Invalid coupon code applied", 400);

    const existingItem = _.find(
      userCart.items,
      (item) => item.product.toString() === productId
    );

    if (!_.isEmpty(existingItem)) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
      existingItem.total =
        existingItem.quantity * product.price - existingItem.discount;
    }

    if (_.isEmpty(existingItem)) {
      userCart.items.push({
        product: productId,
        quantity,
        price: product.price,
        total: quantity * product.price,
        discount: 0,
      });
    }

    if (!_.isEmpty(coupon)) {
      userCart.couponApplied = coupon._id;
      _.forEach(userCart.items, (item) => {
        item.discount = (item.price * coupon.discountPercentage) / 100;
        item.total = (item.price - item.discount) * item.quantity;
      });
    }

    userCart.totalCartValue = _.sumBy(userCart.items, "total");
    await userCart.save();

    const updatedUserCart = await Cart.findOne({ _id: userCart._id })
      .populate("items.product")
      .populate("couponApplied")
      .lean();

    await Promise.all([
      req.session.commitTransaction(),
      req.session.endSession(),
    ]);

    res.status(201).send(
      responder("product added to cart successfully.", {
        cart: updatedUserCart,
      })
    );
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const { ACTIVE_USER } = req;

    const cart = await Cart.findOne({ user: ACTIVE_USER._id })
      .populate("items.product")
      .populate("couponApplied");

    await Promise.all([
      req.session.commitTransaction(),
      req.session.endSession(),
    ]);

    res.status(200).send(responder("cart data", { cart }));
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

const deleteCartProduct = async (req, res, next) => {
  try {
    const { ACTIVE_USER, body } = req;
    const { productDetails } = body;

    const { productId } = productDetails;

    const userCart = await Cart.findOne({ user: ACTIVE_USER._id });
    if (_.isEmpty(userCart))
      throw new ApplicationError("Cart not found for current user", 400);

    const product = await Product.findOne({ _id: productId }).lean();
    if (_.isEmpty(product))
      throw new ApplicationError("Invalid product request", 400);

    const itemIndex = _.findIndex(
      userCart.items,
      (item) => item.product.toString() === productId
    );

    if (_.isEqual(itemIndex, -1))
      throw new ApplicationError("Product not found in cart", 400);

    userCart.items.splice(itemIndex, 1);
    userCart.totalCartValue = _.sumBy(userCart.items, "total");

    if (_.isEqual(userCart.totalCartValue, 0) || _.isEmpty(userCart.items)) {
      userCart.couponApplied = null;
    }

    await userCart.save();

    await Promise.all([
      req.session.commitTransaction(),
      req.session.endSession(),
    ]);

    res.status(200).send(
      responder("Product removed from cart successfully.", {
        cart: userCart,
      })
    );
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

module.exports = { create, get, deleteCartProduct };
