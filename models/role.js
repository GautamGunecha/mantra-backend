const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roleSchema = new Schema(
  {
    roleType: {
      type: String,
      enum: ["admin", "vendor", "customer", "delivery_partners"],
      unique: true,
    },
  },
  { timestamps: true }
);

roleSchema.index({ roleType: 1 }, { unique: true });

const Role = model("Role", roleSchema);
module.exports = Role;
