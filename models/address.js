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
    },
    pincode: {
      type: String,
    },
    country: {
      type: String,
    },
    primary: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Address = model("Address", addressSchema);
module.exports = Address;
