const mongoose = require("mongoose");
const connectToDB = async () => {
  await mongoose.connect(process.env.DATABASE_CONNECTION_URL);
};

module.exports = connectToDB;
