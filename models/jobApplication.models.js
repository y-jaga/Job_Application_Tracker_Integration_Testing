const { sequelize } = require("../db/init");
const { DataTypes } = require("sequelize");

const JobApplication = sequelize.define("JobApplication", {
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jdUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM(
      "no reply",
      "rejected",
      "interview",
      "selected",
      "accepted"
    ),
    defaultValue: "no reply",
  },
  interviewRounds: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = JobApplication;
