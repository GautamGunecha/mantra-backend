const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const sweetUserRoleSchema = new Schema(
  {
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

sweetUserRoleSchema.index({ assignedTo: 1, role: 1 });

const SweetUserRole = model("SweetUserRole", sweetUserRoleSchema);
module.exports = SweetUserRole;
