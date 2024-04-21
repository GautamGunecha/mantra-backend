const _ = require("lodash");
const Category = require("../../models/category");

const findOrCreateCategory = async (config) => {
  const { category: productCategory, subCategory, preference } = config;
  const filter = {
    primary: productCategory,
    sub: subCategory,
    preference,
  };

  let category = await Category.findOne(filter);

  if (_.isEmpty(category)) {
    const update = {
      $setOnInsert: filter,
    };

    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    };

    category = await Category.findOneAndUpdate(filter, update, options);
  }

  return category;
};

const createProductDescription = async (config) => {
  const {
    headLiner,
    sentType = "",
    fragranceDescription = {},
    notes = [],
  } = description;
};

module.exports = {
  findOrCreateCategory,
  createProductDescription,
};
