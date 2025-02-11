const express = require("express");
const router = express.Router();
const Interview = require("../models/interview.models");
const JobApplication = require("../models/jobApplication.models");

//Add a new interview round for a specific application.
router.post("/:id/interview", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;

    const application = await JobApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    if (!data.roundNum || !data.roundType || !data.interviewDate) {
      return res.status(400).json({
        error: "Interview round number, type, and date are required.",
      });
    }

    const newInterview = await Interview.create({
      applicationId: id,
      ...data,
    });

    return res.status(201).json(newInterview);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create new interview round for a specific application.",
    });
  }
});

//Retrieve all interview rounds for a specific application.
router.get("/:id/interview", async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);

    const application = await JobApplication.findByPk(applicationId);

    if (!application) {
      return res
        .status(404)
        .json({ error: "Application not found." });
    }

    const interviews = await Interview.findAll({ where: { applicationId } });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({
      error: "Failed to get all interview rounds for a specific application.",
    });
  }
});

module.exports = router;
