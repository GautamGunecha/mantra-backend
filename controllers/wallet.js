const _ = require("lodash");

const Wallet = require("../models/wallet");
const User = require("../models/user");

const ApplicationError = require("../middlewares/applicationError");
const createPaymentRequest = require("../services/payments");

const addMoney = async (req, res, next) => {
  try {
    const { body, ACTIVE_USER } = req;
    const { balance = 0 } = body;

    if (_.lt(balance, 100)) {
      throw new ApplicationError(
        "Minimum balance should be atleast Rs 100.",
        400
      );
    }

    await findOrCreateWallet(ACTIVE_USER._id, 0);
    const userWallet = await Wallet.findOne({ user: ACTIVE_USER._id }).lean();

    const config = {
      balance,
      purpose: "wallet-recharge",
      provider: "instamojo",
    };

    const response = await createPaymentRequest(config, ACTIVE_USER);
    const { paymentUrl } = response;

    await req.session.commitTransaction();
    req.session.endSession();

    res.status(201).send({
      success: true,
      info: "payment link generated",
      data: {
        wallet: userWallet,
        paymentLink: paymentUrl,
      },
    });
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

const checkBalance = async (req, res, next) => {
  try {
    const { ACTIVE_USER } = req;

    await findOrCreateWallet(ACTIVE_USER._id, 0);
    const userWallet = await Wallet.findOne({ user: ACTIVE_USER._id }).lean();

    await req.session.commitTransaction();
    req.session.endSession();

    res.status(200).send({
      success: true,
      info: "user wallet info",
      data: { wallet: userWallet },
    });
  } catch (error) {
    await req.session.abortTransaction();
    req.session.endSession();
    next(error);
  }
};

const findOrCreateWallet = async (user_id, balance = 0) => {
  const userWallet = await Wallet.findOneAndUpdate(
    { user: user_id },
    { $setOnInsert: { balance } },
    { new: true, upsert: true }
  );

  return userWallet;
};

module.exports = { addMoney, checkBalance };
