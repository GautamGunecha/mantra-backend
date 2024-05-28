const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    description: [
      {
        para: {
          type: String,
          required: true,
        },
      },
    ],
    productProfile: {
      type: String,
      required: true,
    },
    notes: [
      {
        noteType: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    brand: { type: mongoose.Types.ObjectId, ref: "Brand", required: true },
    price: { type: Number, required: true },
    size: {
      type: String,
      required: true,
    },
    quantity: { type: Number, required: true },
    uuid: { type: String, unique: true, required: true },
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return v.match(/(http[s]?:\/\/.*\.(?:png|jpg|gif|svg|jpeg))/i);
          },
          message: (props) => `${props.value} is not a valid image URL!`,
        },
      },
    ],
    categories: { type: mongoose.Types.ObjectId, ref: "Category" },
    seller: { type: mongoose.Types.ObjectId, ref: "User" },
    tags: {
      type: String,
      enum: ["in-stock", "stock-out", "not-availabe", "limited-quantity"],
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ uuid: 1 }, { unique: true });
productSchema.index({ seller: 1 });

const Product = model("Product", productSchema);
module.exports = Product;
