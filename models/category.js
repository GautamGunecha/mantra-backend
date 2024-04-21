const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    primary: {
      type: String,
      required: true,
      enum: ["designer", "niche"],
    },
    sub: {
      type: String,
      required: true,
      enum: ["clone", "edt", "edp", "pure_perfum"],
    },
    preference: {
      type: String,
      required: true,
      enum: ["male", "women", "unisex"],
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ primary: 1, sub: 1, preference: 1 });

const Category = model("Categories", categorySchema);
module.exports = Category;
