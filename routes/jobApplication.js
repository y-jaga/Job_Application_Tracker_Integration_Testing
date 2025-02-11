const express = require("express");
const { Op } = require("sequelize");
const JobApplication = require("../models/jobApplication.models");
const router = express.Router();

//Create a new job application.
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (!data.role || !data.company) {
      return res.status(400).json({ error: "Role and company are required." });
    }

    const newJobApp = await JobApplication.create(data);

    res.status(201).json(newJobApp);
  } catch (error) {
    res.status(500).json({ error: "Failed to create new job application" });
  }
});

//Get all job applications
router.get("/", async (req, res) => {
  try {
    const { company, status, from, to } = req.query;

    let where = {};
    if (company) where.company = company;
    if (status) where.status = status;
    if (from && to)
      where.appliedAt = {
        [Op.between]: [new Date(from), new Date(to)],
      };

    const applications = await JobApplication.findAll({ where });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to get all job applications" });
  }
});

//Retrieve a specific job application by ID.
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const application = await JobApplication.findByPk(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to get job application by id" });
  }
});

//Update a specific job application
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, interviewRounds } = req.body;

    if (typeof status !== "string") {
      return res.status(400).json({ error: "Invlaid status value." });
    }
    if (typeof interviewRounds !== "number") {
      return res.status(400).json({ error: "Invalid interviewRounds value." });
    }

    const application = await JobApplication.findByPk(id);

    if (!application)
      return res.status(404).json({ error: "Application not found." });

    if (status) application.status = status;
    if (interviewRounds) application.interviewRounds = interviewRounds;

    await application.save();

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: "Failed to update job application by id" });
  }
});

//Delete an application.
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const application = await JobApplication.findByPk(id);

    if (!application)
      return res.status(404).json({ error: "Application not found." });

    await application.destroy();

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job application by id" });
  }
});

module.exports = router;
