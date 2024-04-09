const _ = require("lodash");
const ApplicationError = require("../../middlewares/applicationError");

const validatePassword = (password) => {
  const passwordLength = _.size(password);
  const hasAlphabet = /[a-zA-Z]/.test(password);
  const hasNumeric = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (passwordLength < 6) {
    throw new ApplicationError(
      "Password should be at least 6 characters long.",
      400
    );
  }

  if (!hasAlphabet) {
    throw new ApplicationError(
      "Password should have at least one alphabet.",
      400
    );
  }

  if (!hasNumeric) {
    throw new ApplicationError(
      "Password should have at least one numeric character.",
      400
    );
  }

  if (!hasSpecialChar) {
    throw new ApplicationError(
      "Password should have at least one special character.",
      400
    );
  }

  return true;
};

module.exports = { validatePassword };
