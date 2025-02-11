const express = require("express");
const JobApplication = require("../models/jobApplication.models");
const { Op } = require("sequelize");
const { sequelize } = require("../db/init");
const router = express.Router();

router.get("/applications", async (req, res) => {
  try {
    const { from, to, status } = req.query;

    const whereFromToFilter = {};
    if (from && to) {
      whereFromToFilter.appliedAt = {
        [Op.between]: [new Date(from), new Date(to)],
      };
    }

    const applicationsByTimePeriod = await JobApplication.count({
      where: whereFromToFilter,
    });

    // SELECT status, COUNT(status) AS count
    // FROM JobApplication
    // GROUP BY status;
    // WHERE status = "${status}"

    const whereStatus = status !== undefined ? { status } : {};

    const applicationsStatus = await JobApplication.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"],
      ],
      where: whereStatus,
      group: "status",
    });

    const applicationsByStatus = applicationsStatus.reduce((acc, statusObj) => {
      acc[statusObj.dataValues.status] = statusObj.dataValues.count;
      return acc;
    }, {});

    return res
      .status(200)
      .json({ applicationsByTimePeriod, applicationsByStatus });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reports." });
  }
});

module.exports = router;
