const _ = require("lodash");

const Profile = require("../models/profile");
const User = require("../models/user");

const update = async ({ ACTIVE_USER, body = {} }, res, next) => {
  try {
    const { profile = {} } = ACTIVE_USER;
    const {
      email,
      password,
      address,
      countryCode,
      phone,
      dateOfBirth,
      gender,
    } = body;

    res.send({ success: true, info: "profile updated", data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { update };
