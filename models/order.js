const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalOrderValue: {
      type: Number,
      required: true,
    },
    billingAddress: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    shippingAddress: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered"],
      default: "pending",
    },
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index();
const Order = model("Order", orderSchema);

module.exports = Order;
