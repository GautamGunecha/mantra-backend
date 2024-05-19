const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const walletSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "inr",
      enum: ["inr"],
    },
  },
  { timestamps: true }
);

walletSchema.index({ user: 1 });

const Wallet = model("Wallet", walletSchema);
module.exports = Wallet;
