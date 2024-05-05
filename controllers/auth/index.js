const _ = require("lodash");

const User = require("../../models/user");
const Profile = require("../../models/profile");
const SweetUserRole = require("../../models/sweetUserRole");
const Role = require("../../models/role");

const ApplicationError = require("../../middlewares/applicationError");
const { encryptPassword, comparePassword } = require("../../services/bcrypt");
const {
  newUserVerificationToken,
  validateNewUserVerificationToken,
  generateAuthToken,
  validateAuthToken,
  generatePasswordResetToken,
  validatePasswordResetToken,
} = require("../../services/jwt");
const { triggerEmailNotification } = require("../../utilities/notifications");
const { validatePassword } = require("../../utilities/helpers/auth");
const keys = require("../../configs/keys");
const { CLIENT_URL, NODE_ENV } = keys;

const register = async (req, res, next) => {
  try {
    const { body = {} } = req;
    if (_.isEmpty(body)) {
      throw new ApplicationError("Required data not found.", 400);
    }

    const { firstName = "", lastName = "", email = "", password = "" } = body;
    if (_.isEmpty(firstName) || _.isEmpty(email) || _.isEmpty(password)) {
      throw new ApplicationError("Required user credentials not found.", 400);
    }

    const user = await User.findOne({ email });
    if (!_.isEmpty(user)) {
      throw new ApplicationError("Email already registered!", 400);
    }

    validatePassword(password);

    const encryptedPassword = await encryptPassword(password);
    const newUserCredentials = {
      firstName,
      lastName,
      email,
      password: encryptedPassword,
    };

    const token = newUserVerificationToken(newUserCredentials);
    const verificationUrl = `${CLIENT_URL}validate/email/${token}`;
    const notificationConfig = {
      verificationUrl,
      firstName,
      to: email,
      lastName,
      source: "NEW_USER_REGISTRATION",
      subject: "Email Verification",
    };

    triggerEmailNotification(notificationConfig);

    res.send({
      success: true,
      info: "Check email for confirmation",
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

const validateUser = async (req, res, next) => {
  try {
    const { token = "" } = req.body;
    if (_.isEmpty(token)) {
      throw new ApplicationError("Required user verification token", 400);
    }

    const { payload = {} } = validateNewUserVerificationToken(token);
    const { firstName, lastName, email, password } = payload;

    const user = await User.findOne({ email });
    if (!_.isEmpty(user)) {
      throw new ApplicationError("Email already registered!", 400);
    }

    const newUserProfile = new Profile({
      firstName,
      lastName,
      email,
    });

    const profile = await newUserProfile.save();
    const role = await Role.findOne({
      roleType: "customer",
      active: true,
    }).lean();

    const newUser = await User.create({
      email,
      password,
      profile: profile._id,
    });

    await SweetUserRole.create({
      role: role._id,
      active: true,
      assignedTo: newUser._id,
    });

    res
      .status(201)
      .send({ success: true, info: "Registered success.", data: {} });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body;
    if (_.isEmpty(email) || _.isEmpty(password)) {
      throw new ApplicationError("Required user creadentails to login", 400);
    }

    const user = await User.findOne({ email })
      .populate({
        path: "profile",
        populate: {
          path: "address",
        },
      })
      .lean();

    if (_.isEmpty(user)) {
      throw new ApplicationError("Invalid user creadentails", 400);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApplicationError("Wrong Credentials! Try again.", 400);
    }

    const authToken = generateAuthToken(user._id);
    await User.updateOne(
      { _id: user._id },
      { $set: { loggedinAt: new Date() } }
    );

    const sweetUserRole = await SweetUserRole.find({
      assignedTo: user._id,
      active: true,
    }).populate("role");

    const assignedRoles = _.map(sweetUserRole, "role.roleType");
    user.role = assignedRoles;
    const currentUser = _.omit(user, "password");

    res
      .cookie("authToken", authToken, {
        expire: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .send({
        success: true,
        info: "Login success",
        data: { currentUser, token: authToken },
      });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const authToken = req.cookies.authToken;
    if (_.isEmpty(authToken)) {
      res.send({ success: true, info: "User already logged out.", data: {} });
      return;
    }

    const { payload = {} } = validateAuthToken(authToken);

    const { id } = payload;
    if (_.isEmpty(authToken) || _.isEmpty(id)) {
      throw new ApplicationError("Invalid session", 400);
    }

    await User.findOneAndUpdate({ _id: id }, { loggedoutAt: new Date() });

    res.clearCookie("authToken");
    res.send({ success: true, info: "Logout Success", data: {} });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async ({ body = {} }, res, next) => {
  try {
    const { email = "" } = body;
    if (_.isEmpty(email)) {
      throw new ApplicationError("Required email id", 400);
    }

    const user = await User.findOne({ email });
    if (_.isEmpty(user)) {
      throw new ApplicationError("User with this email not found", 400);
    }

    const token = generatePasswordResetToken(user.id);
    const redirectUrl = `${CLIENT_URL}/auth/reset/password/${token}`;

    triggerEmailNotification({
      firstName: user.firstName,
      lastName: user.lastName,
      redirectUrl,
      to: email,
      source: "PASSWORD_RESET",
      subject: "Mantra Password Reset.",
    });

    res.status(200).send({
      success: true,
      info: "reset link has been sent to registered email id.",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async ({ body = {} }, res, next) => {
  try {
    const { token, password } = body;
    if (_.isEmpty(token)) {
      throw new ApplicationError("Invalid request received", 400);
    }

    if (_.isEmpty(password)) {
      throw new ApplicationError("Required new password.", 400);
    }

    const { payload = {} } = validatePasswordResetToken(token);
    const { id } = payload;

    validatePassword(password);
    const encryptedPassword = await encryptPassword(password);

    await User.findOneAndUpdate({ _id: id }, { password: encryptedPassword });
    res
      .status(200)
      .send({ success: true, info: "Password reset success", data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  validateUser,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
