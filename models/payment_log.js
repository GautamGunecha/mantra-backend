const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const paymentLogSchema = new Schema({}, { timestamps: true });

const PaymentLog = model("PaymentLogs", paymentLogsSchema);
module.exports = PaymentLog;
