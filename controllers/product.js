const _ = require("lodash");
const { fromString } = require("uuidv4");

const Product = require("../models/product");
const ProductDescription = require("../models/productDescription");
const Category = require("../models/category");
const Brand = require("../models/brand");

const {
  findOrCreateCategory,
  createProductDescription,
} = require("../utilities/helpers/product");
const responder = require("../utilities/responder");

const ApplicationError = require("../middlewares/applicationError");

const create = async (req, res, next) => {
  try {
    const { body = {}, ACTIVE_USER } = req;
    const {
      title = "",
      description = {},
      brandName = "",
      price = 0,
      size = "",
      images = [],
    } = body;

    if (_.isEmpty(title)) {
      throw new ApplicationError("Product must have title tag", 400);
    }

    if (_.isEqual(price, 0)) {
      throw new ApplicationError("Product price must not be zero.", 400);
    }

    if (_.isEmpty(description)) {
      throw new ApplicationError("Required product description", 400);
    }

    if (_.isEmpty(brandName)) {
      throw new ApplicationError("Required product brand name details", 400);
    }

    const productUuid = fromString(title);
    const similarProduct = await Product.findOne({
      uuid: productUuid,
      seller: ACTIVE_USER._id,
    });

    if (!_.isEmpty(similarProduct)) {
      throw new ApplicationError("Similar Product already exists.", 400);
    }

    const productCategory = await findOrCreateCategory(body);
    const productDescription = await createProductDescription(description);

    await req.session.commitTransaction();
    req.session.endSession();

    res.status(201).send(responder("product created successfully.", {}));
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

const get = async ({ ACTIVE_USER }, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
};
