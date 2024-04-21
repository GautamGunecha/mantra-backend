const Brand = require("../models/brand");
const responder = require("../utilities/responder");

const get = async (req, res, next) => {
  const brands = await Brand.find().select("-uuid -isActive");
  res.send(responder("brands data", { brands }));
};

module.exports = { get };
