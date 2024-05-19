const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paymentRequestSchema = new Schema(
  {
    requestId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: ["wallet-recharge", "purchase"],
    },
    status: {
      type: String,
      enum: ["pending", "initiated", "completed"],
      required: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ["instamojo"],
      default: "instamojo",
    },
    paymentUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
    },
    userPaymentId: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    webhookUri: {
      type: String,
    },
    redirectUri: {
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
