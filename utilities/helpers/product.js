const _ = require("lodash");
const Category = require("../../models/category");

const findOrCreateCategory = async (categories) => {
  const { primary, sub, preference } = categories;

  const category = await Category.findOneAndUpdate(
    { primary, sub, preference },
    { $setOnInsert: { primary, sub, preference } },
    { new: true, upsert: true }
  );

  return category;
};

const validateNotes = (notes) => {
  const requiredNoteTypes = ["Top Notes", "Middle Notes", "Base Notes"];
  const noteTypes = notes.map((note) => note.noteType);

  const hasAllNoteTypes = requiredNoteTypes.every((requiredType) =>
    noteTypes.includes(requiredType)
  );

  return hasAllNoteTypes;
};

module.exports = {
  findOrCreateCategory,
  validateNotes,
};
