const _ = require("lodash");
const ApplicationError = require("../middlewares/applicationError");

const captureWebhookResponse = async (
  { body = {}, query = {}, params = {} },
  res,
  next
) => {
  try {
    if (_.isEmpty(body)) {
      return;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = captureWebhookResponse;
