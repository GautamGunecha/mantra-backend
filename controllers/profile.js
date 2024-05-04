const _ = require("lodash");

const Profile = require("../models/profile");
const User = require("../models/user");

const { validatePassword } = require("../utilities/helpers/auth");
const { encryptPassword } = require("../services/bcrypt");
const ApplicationError = require("../middlewares/applicationError");

const update = async (req, res, next) => {
  try {
    const { ACTIVE_USER, body } = req;
    const { profile = {} } = ACTIVE_USER;
    const {
      firstName,
      lastName,
      email,
      password,
      countryCode,
      phone,
      dateOfBirth,
      gender,
    } = body;

    const updateFields = {};

    if (!_.isEmpty(password)) {
      validatePassword(password);
      const encryptedPassword = await encryptPassword(password);
      updateFields.password = encryptedPassword;
    }

    if (!_.isEmpty(email) && !_.isEqual(email, ACTIVE_USER.email)) {
      const existingUser = await User.findOne({ email });
      if (!_.isEmpty(existingUser)) {
        throw new ApplicationError("Email not available. Try new email", 400);
      }
      updateFields.email = email;
      updateFields.email_verified = false;

      await Profile.findByIdAndUpdate(
        { _id: profile._id },
        { $set: { email } }
      );
    }

    const profileUpdateFields = {
      firstName: firstName || profile.firstName,
      lastName: lastName || profile.lastName,
      countryCode: countryCode || profile.countryCode,
      phone: _.toNumber(phone) || profile.phone,
      gender: gender || profile.gender,
      dateOfBirth: dateOfBirth || profile.dateOfBirth,
    };

    await Promise.all([
      User.findByIdAndUpdate({ _id: ACTIVE_USER._id }, { $set: updateFields }),
      Profile.findByIdAndUpdate(
        { _id: profile._id },
        { $set: profileUpdateFields }
      ),
      req.session.commitTransaction(),
      req.session.endSession(),
    ]);

    res.send({
      success: true,
      info: "profile updated",
      data: {},
    });
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();

    next(error);
  }
};

module.exports = { update };
