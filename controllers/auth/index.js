const _ = require("lodash");

const User = require("../../models/user");
const ApplicationError = require("../../middlewares/applicationError");
const { encryptPassword } = require("../../services/bcrypt");
const {
  newUserVerificationToken,
  validateNewUserVerificationToken,
  generateAuthToken,
  validateAuthToken,
} = require("../../services/jwt");
const { triggerEmailNotification } = require("../../utilities/notifications");
const { validatePassword } = require("../../utilities/helpers/auth");
const { CLIENT_URL } = process.env;

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

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await newUser.save();
    const sessionToken = generateAuthToken(newUser.id);

    req.session.SESSION_TOKEN = sessionToken;
    res
      .status(201)
      .send({ success: true, info: "Registered success.", data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, validateUser };
