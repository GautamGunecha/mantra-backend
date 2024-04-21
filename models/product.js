const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: mongoose.Types.ObjectId,
      ref: "ProductDescription",
      required: true,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "brand",
    },
    price: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
      enum: ["10ml", "20ml", "50ml", "100ml", "150ml", "200ml"],
      default: "100ml",
    },
    quantity: {
      type: Number,
      required: true,
    },
    uuid: {
      type: String,
      unique: true,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    categories: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },

    seller: {
      type: mongoose.Types.ObjectId,
      ref: "User",
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

productSchema.index({ uuid: 1 }, { unique: true });
productSchema.index({ seller: 1 });

const Product = model("Products", productSchema);
module.exports = Product;
