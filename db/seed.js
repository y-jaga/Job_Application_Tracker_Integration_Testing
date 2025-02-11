const Interview = require("../models/interview.models");
const JobApplication = require("../models/jobApplication.models");
const { connectDB } = require("./init");

const seedDb = async () => {
  try {
    await connectDB();

    await JobApplication.sync({ force: true });
    await Interview.sync({ force: true });

    await JobApplication.bulkCreate([
      {
        role: "Business Analyst",
        company: "DianApps",
        jdUrl: "https://dianapps.com/jobs/se",
        appliedAt: "2024-06-05",
      },
    ]);

    await Interview.bulkCreate([
      {
        applicationId: 1,
        roundNum: 1,
        roundType: "telephonic",
        interviewDate: "2024-04-18",
        questions: "What is your experience with Node.js?",
        roleOffered: null,
        compensationOffered: null,
      },
    ]);

    console.log("Database successfully seededed");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed database");
  }
};

seedDb();
