const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Products",
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
        total: {
          type: Number,
        },
        discount: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalCartValue: {
      type: Number,
      default: 0,
    },
    couponApplied: {
      type: mongoose.Types.ObjectId,
      ref: "coupon",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.index({ user: 1 });

const Cart = model("Cart", cartSchema);
module.exports = Cart;
