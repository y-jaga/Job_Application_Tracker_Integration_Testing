# Job_Application_Tracker_Integration_Testing

##**DESCRIPTION**
Job Application Tracker allows individuals to track their job applications, interview progress, and offers. The tracker will allow users to:
- Add and manage job applications.
- Update application status and track interview rounds.
- Generate reports based on the applications and their status.

##**FEATURES**
1. **Job Application Management** -  Create a, read all, update a, and delete a job applications.
2. **Filtering & sorting** - Filter and sort job application by status(e.g., how many interviews, selected, or rejected), time preiod{from(YYYY/MM/DD) & to(YYYY/MM/DD)}.
3. **Report Generation** - Generate job application report based on status(e.g. how many interviews, selected or rejected).

##**INSTALLATION**
Steps to install and set up the project locally.
```sh
git clone https://github.com/y-jaga/Job_Application_Tracker_Integration_Testing.git
cd Job_Application_Tracker_Integration_Testing
npm install

## __API Documentation__

### Job Application
| Method | Endpoint                                         | Description                                 |
|--------|--------------------------------------------------|---------------------------------------------|
| POST   | `/applications`                                  |Create a new job application.                |
| GET    | `/applications`                                  | Retrieve all job applications.              |
| GET    | `/applications?company=Tech Corp`                | Retrieve job application by comapny name    |
| GET    | `/applications?status=interview`                 | Retrieve job application by comapny status  |
| GET    | `/applications?from=2024-01-01&to=2024-01-31`    | Retrieve job application within a date range|
| GET    | `/applications/:id`                              |Retrieve a specific job application by ID.   |
| PUT    | `/applications/:id`                              |Update an existing job application.          |
| DELETE | `/applications/:id`                              |Delete an application.                       |

### INTERVIEW
| Method| Endpoint                        | Description                                             |
|-------|---------------------------------|---------------------------------------------------------|
| POST  | `/applications/:id/interview`   |Add a new interview round for a specific application.    |
| GET   | `/applications/:id/interview`   |Retrieve all interview rounds for a specific application.|

### Reporting and Sorting
| Method| Endpoint                                              | Description                                                                     |
|-------|-------------------------------------------------------|---------------------------------------------------------------------------------|
| GET   | `/reports/applications?from=2024-01-01&to=2024-01-31` |Return the total number of applications submitted within a specific time period .|
| GET   | `/reports/applications?status=interviews`             |Return the total number of applications by status.                               |


## **INTEGRATION TESTING**
Integration testing ensures that different components of the Job Application Tracker work together correctly. It helps verify API endpoints, database interactions, and error handling.

### **Testing Scope**
The integration tests cover:
- **Job Application API**: Creating, updating, retrieving, and deleting job applications.
- **Interview Management**: Adding and retrieving interview rounds.
- **Filtering & Reporting**: Testing query parameters for filtering applications by date and status.
- **Error Handling**: Testing invalid requests and edge cases.

### Testing Tools
-- Jest : For running automated tests
-- Supertest : For API endpoint testing
-- Postman : For manual API Testing

### Run tests
-- npm run test
