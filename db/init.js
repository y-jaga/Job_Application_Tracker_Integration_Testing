const { Sequelize } = require("sequelize");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, process.env.DB_FILE),
  logging: process.env.NODE_ENV !== "test", //disable logging during testing
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log(`Database successfully connected: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error("Failed to connect to database.");
  }
};

module.exports = { sequelize, connectDB };
