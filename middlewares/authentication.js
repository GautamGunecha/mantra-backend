const _ = require("lodash");
const mongoose = require("mongoose");

const User = require("../models/user");
const SweetUserRole = require("../models/sweetUserRole");

const ApplicationError = require("./applicationError");
const { validateAuthToken } = require("../services/jwt");

const auth = async (req, res, next) => {
  try {
    const authToken = req?.cookies?.authToken;
    if (_.isEmpty(authToken)) {
      throw new ApplicationError("Access denied.", 403);
    }

    const { payload = {} } = validateAuthToken(authToken);
    const { id } = payload;

    const user = await User.findById({ _id: id })
      .select("-password")
      .populate("profile")
      .lean();

    if (_.isEmpty(user)) {
      throw new ApplicationError("Access denied.", 403);
    }

    const userRole = await SweetUserRole.find({
      assignedTo: user._id,
    })
      .populate("role")
      .lean();

    const roleTypes = _.map(userRole, "role.roleType");
    user.roles = roleTypes;

    req.ACTIVE_USER = user;

    // Start the mongoose session
    req.session = await mongoose.startSession();
    req.session.startTransaction();

    next();
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  auth(req, res, async () => {
    const { ACTIVE_USER } = req;
    const { roles = [] } = ACTIVE_USER;

    if (_.includes(roles, "admin")) {
      next();
    } else {
      await req.session.abortTransaction();
      req.session.endSession();
      res.send({ success: false, info: "Access denied.", data: {} });
    }
  });
};

const isVendor = async (req, res, next) => {
  auth(req, res, async () => {
    const { ACTIVE_USER } = req;
    const { roles = [] } = ACTIVE_USER;

    if (_.includes(roles, "admin") || _.includes(roles, "vendor")) {
      next();
    } else {
      await req.session.abortTransaction();
      req.session.endSession();
      res
        .status(403)
        .send({ success: false, info: "Access denied.", data: {} });
    }
  });
};

const isDeliveryPartner = async (req, res, next) => {
  auth(req, res, async () => {
    const { ACTIVE_USER } = req;
    const { roles = [] } = ACTIVE_USER;

    if (_.includes(roles, "admin") || _.includes(roles, "delivery_partner")) {
      next();
    } else {
      await req.session.abortTransaction();
      req.session.endSession();
      res.send({ success: false, info: "Access denied.", data: {} });
    }
  });
};

module.exports = {
  auth,
  isAdmin,
  isVendor,
  isDeliveryPartner,
};
