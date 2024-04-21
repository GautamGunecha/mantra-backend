const mongoose = require("mongoose");

const keys = require("./keys");
const { MONGODB_URI } = keys;

const connectToMongoDB = async () => {
  mongoose.set("debug", true);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("connected to mongoDB.".info);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongoDB;
