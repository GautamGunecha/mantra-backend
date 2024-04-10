const bcrypt = require("bcrypt");

const generateSalt = async () => {
  const saltRounds = 13;
  const salt = await bcrypt.genSalt(saltRounds);

  return salt;
};

const encryptPassword = async (password) => {
  const salt = await generateSalt();
  const encryptedPassword = await bcrypt.hash(password, salt);

  return encryptedPassword;
};

const comparePassword = async (password, encryptedPassword) => {
  const validatePassword = await bcrypt.compare(password, encryptedPassword);
  return validatePassword;
};

module.exports = { encryptPassword, comparePassword };
