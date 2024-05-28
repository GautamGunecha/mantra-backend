const _ = require("lodash");
const moment = require("moment");

const Coupon = require("../../models/coupon");

const ApplicationError = require("../../middlewares/applicationError");
const Product = require("../../models/product");

const validateAppliedCouponCode = async (cartInfo) => {
  const { couponApplied, totalCartValue } = cartInfo;
  const coupon = await Coupon.findOne({
    _id: couponApplied,
    isValid: true,
  }).lean();
  if (_.isEmpty(coupon)) throw ApplicationError("Invalid coupon code", 400);

  const { condition, usageCount, maxUsageCountAllowed, validityTill } = coupon;
  const { amount } = condition;

  if (usageCount >= maxUsageCountAllowed) {
    throw new ApplicationError("Coupon code expired.", 400);
  }

  const currentDate = moment();
  const validityDate = moment(validityTill);

  if (currentDate.isAfter(validityDate)) {
    throw new ApplicationError("Coupon code expired.", 400);
  }

  if (amount > totalCartValue)
    throw new ApplicationError(
      "This coupon code can't be used, for current cart value",
      400
    );

  return true;
};

const validateCartItems = async (userCart) => {
  const { items } = userCart;

  for (const item of items) {
    const product = await Product.findOne({
      _id: item.product,
      isActive: true,
    }).lean();

    if (_.isEmpty(product))
      throw new ApplicationError("Invalid product purchase request", 400);

    if (product.quantity < item.quantity)
      throw new ApplicationError("Product out of stock.", 400);
  }

  return true;
};

module.exports = { validateAppliedCouponCode, validateCartItems };
