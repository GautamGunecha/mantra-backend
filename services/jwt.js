const jwt = require("jsonwebtoken");
const fs = require("fs");

const { SECRET_AUTH_KEY } = process.env;

const privateKey = fs.readFileSync("private.key", "utf8");

const newUserVerificationToken = (info) =>
  jwt.sign(info, privateKey, { algorithm: "RS256" });

const validateNewUserVerificationToken = (token) =>
  jwt.verify(token, privateKey, { complete: true });

const generateAuthToken = (id) => jwt.sign({ id }, SECRET_AUTH_KEY);
const validateAuthToken = (token) =>
  jwt.verify(token, SECRET_AUTH_KEY, { complete: true });

module.exports = {
  newUserVerificationToken,
  validateNewUserVerificationToken,
  generateAuthToken,
  validateAuthToken,
};
