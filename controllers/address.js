const _ = require("lodash");

const Address = require("../models/address");
const Profile = require("../models/profile");
const ApplicationError = require("../middlewares/applicationError");

const create = async (req, res, next) => {
  try {
    const { body = {}, ACTIVE_USER } = req;
    const { profile } = ACTIVE_USER;
    const { houseNumber, city, primary, pincode, type } = body;

    if (_.isEmpty(houseNumber)) {
      throw new ApplicationError("House number is required", 400);
    }

    if (_.isEmpty(city)) {
      throw new ApplicationError("City name is required", 400);
    }

    if (_.isEmpty(pincode)) {
      throw new ApplicationError("Pincode is required", 400);
    }

    if (_.isEmpty(type)) {
      throw new ApplicationError("Address type is required", 400);
    }

    if (primary) {
      await Address.updateMany(
        { profile: profile._id, primary: true },
        { primary: false }
      );
    }

    const newAddress = new Address({
      ...body,
      profile: profile._id,
    });

    await newAddress.save();

    await Profile.findOneAndUpdate(
      { _id: profile._id },
      { $push: { address: newAddress._id } },
      { new: true }
    );

    await req.session.commitTransaction();
    req.session.endSession();

    res.status(201).json({
      success: true,
      info: "Address created successfully",
      data: {
        address: newAddress,
      },
    });
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { ACTIVE_USER, body } = req;
    const { profile } = ACTIVE_USER;
    const { _id: addressId, primary } = body;

    const address = await Address.findOne({ _id: addressId });
    if (_.isEmpty(address)) {
      throw new ApplicationError("Address has already been deleted.", 400);
    }

    await Profile.updateOne(
      { _id: profile._id },
      { $pull: { address: addressId } }
    );

    if (primary) {
      await Address.findOneAndUpdate(
        { profile: profile._id, _id: { $ne: addressId } },
        { $set: { primary: true } },
        { new: true }
      );
    }

    await Address.findByIdAndDelete(addressId);

    await req.session.commitTransaction();
    req.session.endSession();

    res
      .status(200)
      .json({ success: true, info: "Address deleted successfully", data: {} });
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

const getAddress = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = { create, update, deleteAddress, getAddress };
