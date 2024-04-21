const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    productReview: {
      longevity: {
        type: Number,
        min: 0,
        max: 5,
      },
      sillage: {
        type: Number,
        min: 0,
        max: 5,
      },
      compliments: {
        type: Number,
        min: 0,
        max: 5,
      },
      priceValue: {
        type: Number,
        min: 0,
        max: 5,
      },
    },
    comment: {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
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

const Review = model("Reviews", reviewSchema);
module.exports = Review;
