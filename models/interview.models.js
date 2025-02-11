const { sequelize } = require("../db/init");
const { DataTypes } = require("sequelize");
const JobApplication = require("./jobApplication.models");

const Interview = sequelize.define(
  "Interview",
  {
    applicationId: {
      type: DataTypes.INTEGER,
      references: {
        model: JobApplication,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    roundNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roundType: {
      type: DataTypes.ENUM(
        "telephonic",
        "offline",
        "online",
        "take home",
        "live coding",
        "theory"
      ),
      allowNull: false,
    },
    interviewDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    questions: {
      type: DataTypes.TEXT,
    },
    roleOffered: {
      type: DataTypes.STRING,
    },
    compensationOffered: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  }
);

JobApplication.hasMany(Interview, {
  foreignKey: "applicationId",
  onDelete: "CASCADE",
});
Interview.belongsTo(JobApplication, { foreignKey: "applicationId" });

module.exports = Interview;
