const mongoose = require("mongoose");
const DB_CONNECTION_URL = "mongodb://localhost:27017/";

const connectToDB = async () => {
  await mongoose.connect(DB_CONNECTION_URL);
};

module.exports = connectToDB;
