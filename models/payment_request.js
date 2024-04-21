const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paymentRequestSchema = new Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
    },
    provider: {
      type: String,
      required: true,
      enum: ["paypal", "instamojo", "paytm", "bank-transfer"],
    },
    product: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Products",
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    webhookUri: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

paymentRequestSchema.index({ requestId: 1, user: 1 });

const PaymentRequest = model("PaymentRequests", paymentRequestSchema);
module.exports = PaymentRequest;
