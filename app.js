const express = require("express");
const { connectDB } = require("./db/init");
const jobApplicationRoute = require("./routes/jobApplication");
const interviewRoute = require("./routes/interview");
const reportingFeatureRoute = require("./routes/reportingFeatures");
const app = express();

app.use(express.json());

//connect to database
connectDB();

//Job application route.
app.use("/applications", jobApplicationRoute);

//Interview route.
app.use("/applications", interviewRoute);

//Reporting features routes
app.use("/reports", reportingFeatureRoute);

module.exports = app;
