const _ = require("lodash");
const { fromString } = require("uuidv4");

const Product = require("../models/product");
const Category = require("../models/category");
const Brand = require("../models/brand");

const {
  findOrCreateCategory,
  validateNotes,
} = require("../utilities/helpers/product");
const responder = require("../utilities/responder");

const ApplicationError = require("../middlewares/applicationError");

const create = async (req, res, next) => {
  try {
    const { body = {}, ACTIVE_USER } = req;
    if (_.isEmpty(body)) {
      throw new ApplicationError("Required products info.", 400);
    }

    const {
      title,
      description,
      productProfile,
      notes,
      brand,
      price,
      size,
      quantity,
      images,
      categories,
    } = body;

    if (!title) throw new ApplicationError("Required product title", 400);

    const productUuid = fromString(title);
    const product = await Product.findOne({
      uuid: productUuid,
      seller: ACTIVE_USER._id,
    }).lean();

    if (!_.isEmpty(product))
      throw new ApplicationError("Product already exists.", 400);

    const productCategory = await findOrCreateCategory(categories);
    const brandUuid = fromString(brand);
    const productBrand = await Brand.findOne({ uuid: brandUuid });

    const productNotes = validateNotes(notes);
    if (!productNotes)
      throw new ApplicationError("Define all perfume notes", 400);

    if (_.isEmpty(images))
      throw new ApplicationError("Product Images are required", 400);

    const newProduct = new Product({
      title,
      description,
      productProfile,
      notes,
      brand: productBrand._id,
      price,
      size,
      quantity,
      uuid: productUuid,
      images,
      categories: productCategory._id,
      seller: ACTIVE_USER._id,
    });

    await newProduct.save();

    await Promise.all([
      req.session.commitTransaction(),
      req.session.endSession(),
    ]);

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
  update,
  get,
};
