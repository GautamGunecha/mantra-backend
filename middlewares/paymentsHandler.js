const _ = require("lodash");

const PaymentResponseLog = require("../models/paymentResponseLog");
const PaymentRequest = require("../models/payment_request");

const paymentHandler = async (req, res, next) => {
  const { body } = req;
  if (_.isEmpty(body)) {
    return res.status(400).json({
      success: false,
      info: "Request body cannot be empty",
      data: {},
    });
  }

  const log = new PaymentResponseLog({ data: body });
  await log.save();

  // checking if response is valid
  const { payment_request_id } = body;
  const paymentRequest = await PaymentRequest.findOne({
    requestId: payment_request_id,
  });

  if (_.isEmpty(paymentRequest)) {
    return res.status(201).send({
      success: false,
      info: "",
      data: {},
    });
  }

  next();
};

module.exports = paymentHandler;
