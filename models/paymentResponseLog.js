const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paymentResponseLog = new Schema(
  {
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentResponseLog = model("PaymentResponseLog", paymentResponseLog);
module.exports = PaymentResponseLog;
