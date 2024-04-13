const _ = require("lodash");

const User = require("../models/user");
const ApplicationError = require("./applicationError");
const { validateAuthToken } = require("../services/jwt");

const auth = async (req, res, next) => {
  try {
    const { authToken = "" } = req.session;
    if (_.isEmpty(authToken)) {
      throw new ApplicationError("Access denied.", 403);
    }

    const { payload = {} } = validateAuthToken(authToken);
    const { id } = payload;

    const user = await User.findById({ _id: id }).select("-password");
    if (_.isEmpty(user)) {
      throw new ApplicationError("Access denied.", 403);
    }

    req.ACTIVE_USER = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { auth };
