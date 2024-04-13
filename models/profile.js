const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema(
  {
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

const Profile = model('Profile', profileSchema);
module.exports = Profile;
