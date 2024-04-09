const ApplicationError = require("./applicationError");

const apiNotFound = (req, res, next) => {
  const error = new ApplicationError('API endpoint not found', 404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof ApplicationError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).send({ success: false, info: message, data: {} });
};

module.exports = { apiNotFound, errorHandler };
