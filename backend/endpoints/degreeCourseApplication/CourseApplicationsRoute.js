const express = require('express');
const CourseApplicationService = require("./CourseApplicationService");
const router = express.Router();
const { isAuthenticated } = require('../../utils/AuthenticationUtils');
const { handleErrors } = require('../../utils/ErrorHandling');
const { mapId } = require('../../utils/MapId');

// find degree course applications that depend on the query (search function)
// if query is empty after /degreeCourseApplications then just return all applications
// only admin can do this!
router.get('/', isAuthenticated, async function (req, res, next) {
    try {
        const isAdmin = req.tokenData.isAdministrator;
        let courseApplications = null;

        if (isAdmin) {
            // retrieve applications and directly map the '_id' to 'id'
            courseApplications = mapId(await CourseApplicationService.findCourseApplications(req.query), true);
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to retrieve applications of other users." };
        }
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(200).send(courseApplications);

    } catch (err) {

        console.error("CourseApplicationsRoute: router.get('/') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// returns all applications that belong to the user
router.get('/myApplications', isAuthenticated, async function (req, res, next) {
    try {
        const courseApplications = mapId(await CourseApplicationService.getCourseApplications(req.tokenData.userID), true);

        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(200).send(courseApplications);

    } catch (err) {

        console.error("CourseApplicationsRoute: router.get('/') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// create a degree course application
router.post('/', isAuthenticated, async function (req, res, next) {
    try {
        const isAdmin = req.tokenData.isAdministrator;
        let data = req.body;

        // if no admin or there is no applicantUserID in the body -> take userID from token
        if (!isAdmin || !data.applicantUserID) {
            const userID = req.tokenData.userID;
            data.applicantUserID = userID;
        }

        const courseApplication = mapId((await CourseApplicationService.createCourseApplication(data)).toJSON(), false);

        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(201).send(courseApplication);

    } catch (err) {

        console.error("CourseApplicationsRoute: router.post('/') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// update course application:
router.put('/:applicationID', isAuthenticated, async function (req, res, next) {
    try {
        let courseApplication = null;
        if (req.body) {
            courseApplication = mapId((await CourseApplicationService.updateCourseApplication(req.params.applicationID, req.body)).toJSON());
        }
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(200).send(courseApplication);

    } catch (err) {

        console.error("CourseApplicationsRoute: router.put('/:applicationID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// delete course application:
router.delete('/:applicationID', isAuthenticated, async function (req, res, next) {
    try {
        const isAdmin = req.tokenData.isAdministrator;
        const userID = req.tokenData.userID;
        

        await CourseApplicationService.deleteCourseApplication(req.params.applicationID, isAdmin, userID);
        
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(204).send("Deleted degree course application with ID: " + req.params.applicationID);

    } catch (err) {

        console.error("CourseApplicationsRoute: router.delete('/:applicationID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

module.exports = router;