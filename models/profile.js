const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
    },
    countryCode: {
      type: String,
    },
    phone: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    address: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Address",
      },
    ],
  },
  {
    timestamps: true,
  }
);

profileSchema.index({ email: 1 }, { unique: true });
profileSchema.index({ phone: 1 }, { unique: true });

const Profile = model("Profile", profileSchema);
module.exports = Profile;
