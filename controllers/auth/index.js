const _ = require("lodash");

const User = require("../../models/user");
const Profile = require("../../models/profile");
const SweetUserRole = require("../../models/sweetUserRole");

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
const { CLIENT_URL, NODE_ENV } = process.env;

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
    const verificationUrl = `${CLIENT_URL}auth/validate/email/${token}`;

    triggerEmailNotification({
      verificationUrl,
      firstName,
      to: email,
      lastName,
      source: "NEW_USER_REGISTRATION",
      subject: "Email Verification",
    });

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

    const newUser = new User({
      email,
      password,
      profile: profile.id,
    });

    await newUser.save();
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

    const user = await User.findOne({ email });
    if (_.isEmpty(user)) {
      throw new Error("Invalid user creadentails", 400);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Password", 400);
    }

    const authToken = generateAuthToken(user.id);
    let flag = false;
    if (_.isEqual(NODE_ENV, "PRODUCTION")) {
      flag = true;
    }

    await user.updateOne({ $set: { loggedinAt: new Date() } });

    res
      .cookie("authToken", authToken, {
        expire: 24 * 60 * 60 * 1000,
        signed: flag,
      })
      .status(200)
      .send({ success: true, info: "Login success", data: {} });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const authToken = req.cookies.authToken;
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
