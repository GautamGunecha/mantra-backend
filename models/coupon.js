const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const couponTypes = [
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

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    isValid: {
      type: Boolean,
      required: true,
    },
    generatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    maxUsageCountAllowed: {
      type: Number,
      default: 100,
    },
    couponType: {
      type: String,
      enum: couponTypes,
    },
    validityTill: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ generatedBy: 1 });
couponSchema.index({ isValid: 1 });
couponSchema.index({ couponType: 1 });

const Coupon = model("Coupon", couponSchema);
module.exports = Coupon;
