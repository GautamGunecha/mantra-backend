const _ = require("lodash");
const Role = require("../models/role");
const ApplicationError = require("../middlewares/applicationError");

const responder = require("../utilities/responder");

const create = async ({ body = {}, ACTIVE_USER = {} }, res, next) => {
  try {
    const { roleType = "" } = body;
    if (_.isEmpty(roleType)) {
      throw new ApplicationError("Required role type", 400);
    }

    const role = await Role.findOne({ roleType });
    if (!_.isEmpty(role)) {
      throw new ApplicationError("Role already exists", 400);
    }

    const newRole = new Role({
      roleType,
      roleCreatedBy: ACTIVE_USER._id,
    });

    await newRole.save();
    res.send(responder("role created successfully", {}));
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const roles = await Role.find({ active: true });
    res.send(responder("all existing user roles", { roles }));
  } catch (error) {
    next(error);
  }
};

const update = async ({ body = {}, ACTIVE_USER = {} }, res, next) => {
  try {
    const { roleTypeToBeUpdated = "", roleType = "" } = body;

    const role = await Role.findOne({
      roleType: roleTypeToBeUpdated,
      roleCreatedBy: ACTIVE_USER._id,
    });

    if (_.isEmpty(role)) {
      throw new ApplicationError("you can only update roles created by you.");
    }

    await Role.updateOne(
      { _id: role._id },
      {
        $set: {
          roleType,
          active: true,
          deactivatedBy: null,
        },
      }
    );

    res.send(responder("role updated successfully."));
  } catch (error) {
    next(error);
  }
};

const deleteRole = async ({ body = {}, ACTIVE_USER = {} }, res, next) => {
  try {
    const { roleType = "" } = body;
    if (_.isEmpty(roleType)) {
      throw new ApplicationError("Define role type to be deactivated", 404);
    }

    const role = await Role.findOne({ roleType, active: true });
    if (_.isEmpty(role)) {
      throw new ApplicationError(
        "Defined role type doesn't exists or has been deactivated."
      );
    }

    await Role.updateOne(
      {
        _id: role.id,
      },
      {
        $set: {
          active: false,
          deactivatedBy: ACTIVE_USER._id,
        },
      }
    );

    res.send(responder("role deactivated", {}));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  get,
  update,
  deleteRole,
};
