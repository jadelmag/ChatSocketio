const mongoose = require("mongoose");

const dbConnection = () => {
  try {
    mongoose
      .connect(process.env.DB_CNN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(
          "Database running on port 27017: \x1b[32m%s\x1b[0m",
          "online"
        );
      })
      .catch(() => {
        console.log("Database crashed!");
        throw new Error("Database crashed!");
      });
  } catch (err) {
    console.log("Connection to MongoDB crashed!");
    throw new Error("Connection to MongoDB crashed!");
  }
};

module.exports = {
  dbConnection,
};
