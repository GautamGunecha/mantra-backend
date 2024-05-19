const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paymentRequestLogSchema = new Schema(
  {
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

const PaymentRequestLog = mongoose.model(
  "PaymentRequestLog",
  paymentRequestLogSchema
);

module.exports = PaymentRequestLog;
