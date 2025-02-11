const request = require("supertest");
const JobApplication = require("../models/jobApplication.models");
const { sequelize } = require("../db/init");
const app = require("../app");
const Interview = require("../models/interview.models");

beforeEach(async () => {
  await JobApplication.sync({ force: true });

  await JobApplication.bulkCreate([
    {
      role: "Software Engineer",
      company: "Tech Corp",
      jdUrl: "https://techcorp.com/jobs/se",
      appliedAt: "2024-01-01",
      status: "interview",
    },
    {
      role: "Cloud Engineer",
      company: "Cloud Corp",
      jdUrl: "https://cloudcorp.com/jobs/se",
      appliedAt: "2024-03-05",
    },
  ]);
});

beforeEach(async () => {
  await Interview.sync({ force: true });

  await Interview.create({
    applicationId: 1,
    roundNum: 1,
    roundType: "telephonic",
    interviewDate: "2024-02-10",
    questions: "What is your experience with React?",
    roleOffered: null,
    compensationOffered: null,
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe("Job Application API tests", () => {
  it("POST /applications, should create a application successfully", async () => {
    const res = await request(app).post("/applications").send({
      role: "Data Analyst",
      company: "Data Corp",
      jdUrl: "https://datacorp.com/jobs/se",
      appliedAt: "2024-01-25",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.role).toEqual("Data Analyst");
  });

  it("POST /applications, should return 400 bad request when required fields are missing", async () => {
    const res = await request(app).post("/applications").send({
      role: "Data Analyst",
      jdUrl: "https://datacorp.com/jobs/se",
      appliedAt: "2024-01-25",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual("Role and company are required.");
  });

  it("GET /applications, should return all job applications", async () => {
    const res = await request(app).get("/applications");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("GET /applications, should return 200 OK with an empty array when no applications exist", async () => {
    await JobApplication.destroy({ where: {} });

    const res = await request(app).get("/applications");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it("GET /applications/:id, should return a specific job application by its ID.", async () => {
    const res = await request(app).get("/applications/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.role).toEqual("Software Engineer");
  });

  it("GET /applications/:id, should returns a 404 Not Found when trying to retrieve a non-existent job application", async () => {
    const res = await request(app).get("/applications/3");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toEqual("Application not found.");
  });

  it("PUT /applications/:id, should updates the details of a job application on providing valid data.", async () => {
    const res = await request(app)
      .put("/applications/1")
      .send({ status: "interview", interviewRounds: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual("interview");
    expect(res.body.interviewRounds).toBe(1);
  });

  it("PUT /applications/:id, should return 404 not found for non-existent application", async () => {
    const res = await request(app)
      .put("/applications/3")
      .send({ status: "interview", interviewRounds: 1 });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toEqual("Application not found.");
  });

  it("PUT /applications/:id, should return 400 Bad Request when invalid update data is provided.", async () => {
    const res = await request(app)
      .put("/applications/1")
      .send({ status: "interview", interviewRounds: "one" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual("Invalid interviewRounds value.");
  });

  it("DELETE /applications/:id, should delete a job application successfully.", async () => {
    const res = await request(app).delete("/applications/2");

    expect(res.statusCode).toBe(204);
  });

  it("DELETE /applications/:id, should return 404 Not Found for delete a non-existent job application. ", async () => {
    const res = await request(app).delete("/applications/3");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toEqual("Application not found.");
  });
});

describe("Interview API tests", () => {
  it("POST /applications/:id/interview, should adds a new interview round for a job application.", async () => {
    const res = await request(app).post("/applications/1/interview ").send({
      applicationId: 1,
      roundNum: 1,
      roundType: "live coding",
      interviewDate: "2024-02-15",
      questions: "Solve a React problem live",
      roleOffered: null,
      compensationOffered: null,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.applicationId).toBe(1);
    expect(res.body.roundType).toBe("live coding");
  });

  it("POST /applications/:id/interview, should returns a 400 Bad Request when required fields are missing", async () => {
    const res = await request(app).post("/applications/1/interview").send({
      applicationId: 1,
      questions: "Solve a React problem live",
      roleOffered: null,
      compensationOffered: null,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toEqual(
      "Interview round number, type, and date are required."
    );
  });

  it("POST /applications/:id/interview, should returns a 404 Not Found when adding an interview for a non-existent job application.", async () => {
    const res = await request(app).post("/applications/3/interview").send({
      applicationId: 1,
      roundNum: 1,
      roundType: "live coding",
      interviewDate: "2024-02-15",
      questions: "Solve a React problem live",
      roleOffered: null,
      compensationOffered: null,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toEqual("Application not found.");
  });

  it("GET /applications/:id/interview, should returns all interview rounds for a specific job application.", async () => {
    const res = await request(app).get("/applications/1/interview");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("GET /applications/:id/interview, should return 404 Not Found when trying to retrieve interviews for a non-existent job application.", async () => {
    const res = await request(app).get("/applications/3/interview");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toEqual("Application not found.");
  });
});

describe("Filtering and Sorting Applications API tests", () => {
  it("GET /applications?status=interview, should returns job applications with the specified status.", async () => {
    const res = await request(app).get("/applications?status=interview");

    expect(res.statusCode).toBe(200);
    expect(
      res.body.every((application) => application.status === "interview")
    ).toBe(true);
  });

  it("GET /applications?company=Tech Corp, should returns only the job applications for the specified company.", async () => {
    const res = await request(app).get("/applications?company=Tech Corp");

    expect(res.statusCode).toBe(200);
    expect(
      res.body.every((application) => application.company === "Tech Corp")
    ).toBe(true);
  });

  it("GET /applications?company=Google, should return 200 OK status with an empty array", async () => {
    const res = await request(app).get("/applications?company=Google");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
});

describe("Tests for Generating Reports", () => {
  it("GET /reports/applications?from=2024-01-01&to=2024-01-31, should return status code 200 applications submitted in the specified time range.", async () => {
    const res = await request(app).get(
      "/reports/applications?from=2024-01-01&to=2024-01-31"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.applicationsByTimePeriod).toBe(1);
  });

  it("GET /reports/applications?status=interview, should return a 200 OK status and number of applications in given status category.", async () => {
    const res = await request(app).get(
      "/reports/applications?status=interview"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.applicationsByStatus.interview).toBe(1);
  });
});
