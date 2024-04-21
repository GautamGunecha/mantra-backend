const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paragraphSchema = new Schema({
  content: { type: String },
});

const productDescriptionSchema = new Schema(
  {
    headLiner: {
      type: String,
    },
    sentType: {
      type: String,
      required: true,
    },
    fragranceDescription: {
      paraOne: paragraphSchema,
      paraTwo: paragraphSchema,
      paraThree: paragraphSchema,
    },
    notes: [
      {
        heading: {
          type: String,
        },
        image: {
          type: String,
        },
        about: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const ProductDescription = model(
  "ProductDescription",
  productDescriptionSchema
);

module.exports = ProductDescription;
