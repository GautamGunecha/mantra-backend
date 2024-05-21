const _ = require("lodash");

const Config = require("../../../models/configs");
const PaymentRequestLog = require("../../../models/paymentRequestLog");

const processRequest = require("../../../services/axios");
const keys = require("../../../configs/keys");
const ApplicationError = require("../../../middlewares/applicationError");
const { PAYMENT_GATEWAYS } = keys;
const {
  INSTAMOJO_API_KEY,
  INSTAMOJO_BASE_URL,
  INSTAMOJO_AUTH_TOKEN,
  INSTAMOJO_PRIVATE_SALT,
  INSTAMOJO_CLIENT_ID,
  INSTAMOJO_CLIENT_SECRET,
} = PAYMENT_GATEWAYS;

const initiatePaymentRequest = async (requestBody) => {
  const { url, method, body: data } = requestBody;
  if (!url || !method || _.isEmpty(data)) {
    throw new ApplicationError("Missing payment configs");
  }

  const { accessToken } = await generateAccessToken();
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const response = await processRequest(method, url, data, config);

  const log = new PaymentRequestLog({ data: response.data });
  await log.save();

  return response;
};

const getPaymentInfo = async (requestBody) => {
  try {
    const { payment_id } = requestBody;
    if (_.isEmpty(payment_id)) {
      return {};
    }

    const { accessToken } = await generateAccessToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const url = `https://test.instamojo.com/v2/payments/${payment_id}/`;
    const method = "get";

    const response = await processRequest(method, url, {}, config);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const generateAccessToken = async () => {
  const oldTokens = await tokenRecords();
  if (!_.isEmpty(oldTokens)) {
    return oldTokens;
  }

  const url = `${INSTAMOJO_BASE_URL}/oauth2/token/`;
  const method = "post";
  const data = new URLSearchParams();
  data.append("grant_type", "client_credentials");
  data.append("client_id", INSTAMOJO_CLIENT_ID);
  data.append("client_secret", INSTAMOJO_CLIENT_SECRET);
  const httpsConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const response = await processRequest(method, url, data, httpsConfig);
  const { data: responseData } = response;
  const { access_token, expires_in, scope, token_type } = responseData;
  const newConfig = new Config({
    accessToken: access_token,
    provider: "instamojo",
    scope,
    tokenType: token_type,
    expiresIn: expires_in,
    issuedAt: new Date(),
  });

  await newConfig.save();
  return newConfig;
};

const tokenRecords = async () => {
  let tokenRecord = await Config.findOne({ provider: "instamojo" })
    .sort({
      issuedAt: -1,
    })
    .lean();

  if (_.isEmpty(tokenRecord)) {
    return {};
  }

  const currentTime = new Date().getTime();
  const tokenIssuedTime = new Date(tokenRecord.issuedAt).getTime();
  const tokenExpiryTime = tokenIssuedTime + tokenRecord.expiresIn * 1000;

  if (currentTime >= tokenExpiryTime) {
    return {};
  }

  return tokenRecord;
};

module.exports = { initiatePaymentRequest, getPaymentInfo };
