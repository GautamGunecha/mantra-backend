const _ = require("lodash");

const validateCouponType = (couponType) => {
  const validCouponTypes = [
    "percentage_discount",
    "fixed_amount_discount",
    "free_shipping",
    "buy_one_get_one",
    "tiered_discounts",
    "first_purchase_discount",
    "membership_subscription_discount",
    "referral_discount",
    "seasonal_holiday_discounts",
    "flash_sales",
    "conditional_discounts",
    "birthday_anniversary_discounts",
  ];

  return _.includes(validCouponTypes, couponType);
};

module.exports = { validateCouponType };
