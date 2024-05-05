const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const addressSchema = new Schema(
  {
    houseNumber: {
      type: String,
      required: true,
    },
    area: {
      type: String,
    },
    landmark: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: "India",
      enum: ["India"],
    },
    primary: {
      type: Boolean,
      required: true,
      default: false,
    },
    type: {
      type: String,
      required: true,
      enum: ["home", "office"],
    },
    lat: {
      type: Number,
    },
    long: {
      type: Number,
    },
    profile: {
      type: mongoose.Types.ObjectId,
      ref: "Profile",
    },
  },
  { timestamps: true }
);

addressSchema.index({ profile: 1, primary: 1 });

const Address = model("Address", addressSchema);
module.exports = Address;
