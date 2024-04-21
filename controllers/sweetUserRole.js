const _ = require("lodash");

const SweetUserRole = require("../models/sweetUserRole");
const User = require("../models/user");
const Role = require("../models/role");

const ApplicationError = require("../middlewares/applicationError");
const responder = require("../utilities/responder");

const create = async ({ body = {}, ACTIVE_USER = {} }, res, next) => {
  try {
    const { roleType, userEmail = "" } = body;
    if (_.isEmpty(roleType)) {
      throw new ApplicationError(
        "Required role type that need to assigned to user",
        400
      );
    }

    if (_.isEmpty(userEmail)) {
      throw new ApplicationError(
        "required user email to whome role needs to be assigned.",
        400
      );
    }

    const role = await Role.findOne({ roleType, active: true });
    if (_.isEmpty(role)) {
      throw new ApplicationError("For given role type no role exits", 400);
    }

    const user = await User.findOne({ email: userEmail });
    if (_.isEmpty(user)) {
      throw new ApplicationError(
        "User not found to whome role needs to be assigned.",
        400
      );
    }

    const sweetUserRole = await SweetUserRole.findOne({
      role: role._id,
      assignedTo: user._id,
    });

    if (!_.isEmpty(sweetUserRole)) {
      throw new ApplicationError(
        `${roleType} role has already been assigned to ${userEmail}`,
        400
      );
    }

    await SweetUserRole.create({
      role: role._id,
      assignedTo: user._id,
      assignedBy: ACTIVE_USER._id,
    });

    res.send(
      responder(`${roleType} role has been assigned to ${user.email}`, {})
    );
  } catch (error) {
    next(error);
  }
};

const update = async ({ body = {}, ACTIVE_USER = {} }, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const deleteUserRole = async ({ body = {}, ACTIVE_USER = {} }, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const getUserRoles = async ({ body = {}, ACTIVE_USER }, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  update,
  deleteUserRole,
  getUserRoles,
};
