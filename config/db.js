const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL)
    console.log(`MongoDB connected: ${connection.connection.host}`.bgGreen);
  } catch (error) {
    console.error(`Error happens in Mongodb : ${error.message}`);
    process.exit(1)
  }
};

module.exports = connectDb;