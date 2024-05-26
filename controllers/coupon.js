const _ = require("lodash");
const moment = require("moment");
const { fromString } = require("uuidv4");

const Coupon = require("../models/coupon");

const ApplicationError = require("../middlewares/applicationError");
const responder = require("../utilities/responder");
const { validateCouponType } = require("../utilities/helpers/coupon");

const create = async (req, res, next) => {
  try {
    const { ACTIVE_USER, body } = req;
    const {
      code,
      discountPercentage,
      couponType,
      maxUsageCountAllowed,
      condition,
      validityTill,
    } = body;

    const couponUuid = fromString(code);
    const coupon = await Coupon.findOne({
      uuid: couponUuid,
      isValid: true,
      generatedBy: ACTIVE_USER._id,
    });
    if (!_.isEmpty(coupon))
      throw new ApplicationError("Coupon code already exists.", 400);

    if (_.isEqual(discountPercentage, 0) || _.isEqual(discountPercentage, 100))
      throw new ApplicationError("Invalid discount percentage", 400);

    const { amount } = condition;

    const isoValidityTill = moment(validityTill).toISOString();
    if (!isoValidityTill)
      throw new ApplicationError("Invalid validity date", 400);

    const isValidCouponType = validateCouponType(couponType);
    if (!isValidCouponType)
      throw new ApplicationError("Invalid coupon type", 400);

    const newCouponCode = new Coupon({
      uuid: couponUuid,
      code: code,
      generatedBy: ACTIVE_USER._id,
      discountPercentage,
      maxUsageCountAllowed,
      couponType,
      validityTill: isoValidityTill,
      condition: { amount },
    });

    await Promise.all([
      newCouponCode.save(),
      req.session.commitTransaction(),
      req.session.endSession(),
    ]);

    res
      .status(201)
      .send(
        responder("coupon generated successfully.", { coupon: newCouponCode })
      );
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();

    next(error);
  }
};

const get = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  get,
  update,
};
