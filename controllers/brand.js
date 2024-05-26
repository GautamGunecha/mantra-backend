const _ = require("lodash");
const Brand = require("../models/brand");

const responder = require("../utilities/responder");
const ApplicationError = require("../middlewares/applicationError");
const { fromString } = require("uuidv4");

const create = async (req, res, next) => {
  try {
    const { body } = req;
    const { name, value } = body;

    if (_.isEmpty(name) || _.isEmpty(value))
      throw new ApplicationError("Required brand name and it's value", 400);

    const brandUuid = fromString(value);
    const newBrand = new Brand({
      uuid: brandUuid,
      name,
      value,
    });

    await newBrand.save();

    await Promise.all([
      req.session.commitTransaction(),
      req.session.endSession(),
    ]);

    res.status(201).send({
      success: true,
      info: "brand created successfully.",
      data: { brand: newBrand },
    });
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

const get = async (req, res, next) => {
  const brands = await Brand.find().select("-uuid -isActive");
  res.send(responder("brands data", { brands }));
};

module.exports = { create, get };
