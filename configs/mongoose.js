const mongoose = require('mongoose');
const { MONGODB_URI } = process.env;

const connectToMongoDB = async () => {
  mongoose.set('debug', true);

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('connected to mongoDB.'.info)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectToMongoDB;
