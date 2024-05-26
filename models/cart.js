const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  totalCartValue: Number,
  isActive: Boolean,
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
      total: Number,
      discount: Number,
    },
  ],
  couponApplied: { type: Schema.Types.ObjectId, ref: "Coupon" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

cartSchema.index({ user: 1 });

const Cart = model("Cart", cartSchema);
module.exports = Cart;
