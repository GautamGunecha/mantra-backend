const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const sweetUserRoleSchema = new Schema(
  {
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

sweetUserRoleSchema.index({ user: 1 });

const SweetUserRole = model("SweetUserRole", sweetUserRoleSchema);
module.exports = SweetUserRole;
