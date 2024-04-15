const _ = require("lodash");

const User = require("../models/user");
const SweetUserRole = require("../models/sweetUserRole");
const Role = require("../models/role");

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
      .populate("profile");

    if (_.isEmpty(user)) {
      throw new ApplicationError("Access denied.", 403);
    }

    req.ACTIVE_USER = user;
    next();
  } catch (error) {
    next(error);
  }
};

const checkUserRole = async (req, res, next, roleType) => {
  try {
    const { ACTIVE_USER } = req;
    const role = await Role.findOne({ roleType });
    const userRole = await SweetUserRole.findOne({
      role: role.id,
      assignedTo: ACTIVE_USER.id,
    });

    if (_.isEmpty(userRole)) {
      res.status(403).send({ success: false, info: "Access denied", data: {} });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  auth(req, res, async () => {
    await checkUserRole(req, res, next, "admin");
  });
};

const isVendor = async (req, res, next) => {
  auth(req, res, async () => {
    await checkUserRole(req, res, next, "vendor");
  });
};

const isDeliveryPartner = async (req, res, next) => {
  auth(req, res, async () => {
    await checkUserRole(req, res, next, "delivery_partner");
  });
};

module.exports = {
  auth,
  isAdmin,
  isVendor,
  isDeliveryPartner,
};
