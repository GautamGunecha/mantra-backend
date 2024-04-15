const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: mongoose.Types.ObjectId,
      ref: "Profile",
    },
    active: {
      type: Boolean,
      default: true,
    },
    email_verified: {
      type: Boolean,
      default: true,
    },
    loggedinAt: {
      type: Date,
    },
    loggedoutAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ profile: 1 }, { unique: true });

const User = model("Users", userSchema);
module.exports = User;
