const _ = require("lodash");

const PaymentRequestLog = require("../../models/paymentRequestLog");
const PaymentRequest = require("../../models/payment_request");
const PaymentResponseLog = require("../../models/paymentResponseLog");
const User = require("../../models/user");
const Profile = require("../../models/profile");
const Wallet = require("../../models/wallet");

const { getPaymentInfo } = require("../payments/instamojo");

const instamojoPaymentResponse = async (req, res) => {
  const { body } = req;
  if (_.isEmpty(body)) {
    return res.status(201).send({
      success: true,
      info: "webhook received successfully.",
      data: {},
    });
  }

  const paymentInfo = await getPaymentInfo(body);
  const { data: paymentInfoData } = paymentInfo;

  const { status, order_info } = paymentInfoData;
  if (_.isEmpty(paymentInfoData) || !status) {
    return res.status(201).send({
      success: true,
      info: "",
      data: {},
    });
  }

  const { payment_request_id, amount, fees } = body;

  const paymentRequest = await PaymentRequest.findOneAndUpdate(
    {
      requestId: payment_request_id,
    },
    {
      $set: {
        status: _.lowerCase(body.status),
        amount,
        fees,
      },
    }
  ).lean();

  const user = await User.findOne({ _id: paymentRequest.user });
  const { unit_price } = order_info;

  // recharge user wallet
  await Wallet.findOneAndUpdate(
    { user: user._id },
    { $set: { balance: _.toNumber(unit_price) } }
  );

  res.status(201).send({
    success: true,
    info: "success",
    data: {},
  });
};

module.exports = {
  instamojoPaymentResponse,
};
