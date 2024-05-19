const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const configSchema = new Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    provider: {
      type: String,
      required: true,
      enum: ["instamojo"],
    },
    scope: {
      type: String,
      required: true,
    },
    tokenType: {
      type: String,
      required: true,
    },
    expiresIn: {
      type: Number,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

configSchema.index({ provider: 1 });

const Config = model("Configs", configSchema);
module.exports = Config;
