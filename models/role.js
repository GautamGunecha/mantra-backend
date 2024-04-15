const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roleSchema = new Schema(
  {
    roleType: {
      type: String,
      enum: ["admin", "vendor", "customer", "delivery_partner"],
      unique: true,
    },
    roleCreatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    active: {
      type: Boolean,
      default: true,
    },
    deactivatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

roleSchema.index({ roleType: 1 }, { unique: true });

const Role = model("Role", roleSchema);
module.exports = Role;
