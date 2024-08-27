// adding external modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

// adding https certificate and key
const key = fs.readFileSync('./certificates/key.pem');
const cert = fs.readFileSync('./certificates/cert.pem');

// adding own modules
const database = require("./database/db");
const testRoutes = require('./endpoints/test/TestRoutes');
const publicUserRoutes = require('./endpoints/user/PublicUsersRoute');
const userRoutes = require('./endpoints/user/UsersRoute');
const authenticationRoutes = require('./endpoints/authentication/AuthenticationRoute');
const degreeCourseRoutes = require('./endpoints/degreeCourse/DegreeCoursesRoute');
const degreeCourseApplicationRoutes = require('./endpoints/degreeCourseApplication/CourseApplicationsRoute');

const port = 443;

// init app and middleware
const app = express()
const server = https.createServer({ key: key, cert: cert }, app);
app.use(bodyParser.json())

app.use("*", cors())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});

app.use(express.static('public'));

// adding the routes
app.use('/', testRoutes);
app.use('/api/publicUsers', publicUserRoutes);
app.use('/api/users', userRoutes);
app.use('/api/authenticate', authenticationRoutes);
app.use('/api/degreeCourses', degreeCourseRoutes);
app.use('/api/degreeCourseApplications', degreeCourseApplicationRoutes);

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send({ name: 'ServerError', message: "Something went wrong. Please try again later." })
});

app.use(function (req, res, next) {
  res.status(404).send({ name: 'NotFoundError', message: "Sorry, this url is not supported. Please enter a viable url!" })
});

database.connect();

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})