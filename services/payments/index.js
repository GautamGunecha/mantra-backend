const _ = require("lodash");

const PaymentRequest = require("../../models/payment_request");
const User = require("../../models/user");
const Profile = require("../../models/profile");

const ApplicationError = require("../../middlewares/applicationError");
const { initiatePaymentRequest } = require("../../services/payments/instamojo");
const keys = require("../../configs/keys");
const { MANTRA_WEBHOOK_URI, PAYMENT_GATEWAYS } = keys;
const { INSTAMOJO_BASE_URL } = PAYMENT_GATEWAYS;

const createPaymentRequest = async (config, ACTIVE_USER) => {
  const {
    provider = "instamojo",
    balance,
    purpose = "wallet-recharge",
  } = config;

  const requestBody = {
    url: `${INSTAMOJO_BASE_URL}/v2/payment_requests/`,
    method: "post",
    body: {
      amount: balance,
      purpose,
      buyer_name: `${ACTIVE_USER.profile.firstName} ${ACTIVE_USER.profile.lastName}`,
      email: ACTIVE_USER.email,
      phone: ACTIVE_USER.profile.phone,
      redirect_url: "",
      webhook: MANTRA_WEBHOOK_URI,
    },
  };

  const response = await initiatePaymentRequest(requestBody);
  const { data } = response;

  const newPaymentRequest = new PaymentRequest({
    requestId: data.id,
    userPaymentId: data.user,
    phone: data.phone,
    email: data.email,
    amount: balance,
    reason: purpose,
    status: _.lowerCase(data.status),
    provider: "instamojo",
    paymentUrl: data.longurl,
    shortUrl: data.shorturl,
    user: ACTIVE_USER._id,
    webhookUri: data.webhook,
    redirectUri: data.resource_uri,
  });

  await newPaymentRequest.save();
  return newPaymentRequest;
};

module.exports = createPaymentRequest;
