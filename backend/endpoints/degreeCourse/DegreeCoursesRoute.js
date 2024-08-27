const express = require('express');
const DegreeCourseService = require("./DegreeCourseService");
const CourseApplicationService = require('../degreeCourseApplication/CourseApplicationService');
const router = express.Router();
const { isAuthenticated } = require('../../utils/AuthenticationUtils');
const { handleErrors } = require('../../utils/ErrorHandling');
const { mapId } = require('../../utils/MapId');

// find degree courses that depend on the query (search function)
// if query is empty after /degreeCourses then just return all courses
// also user, that are not logged in can do this
router.get('/', async function (req, res, next) {
    try {
        // retrieve degree courses and directly map the '_id' to 'id'
        const degreeCourses = mapId(await DegreeCourseService.findDegreeCourses(req.query), true);

        res.status(200).send(degreeCourses);

    } catch (err) {

        console.error("DegreeCoursesRoute: router.get('/') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// search for applications in one degree course
// only admin can do this!
router.get('/:degreeCourseID/degreeCourseApplications', isAuthenticated, async function (req, res, next) {
    try {
        const isAdmin = req.tokenData.isAdministrator;
        let courseApplications = null;
        let data = { degreeCourseID: req.params.degreeCourseID, }

        if (isAdmin) {
            courseApplications = mapId(await CourseApplicationService.findCourseApplications(data), true);
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to retrieve applications of other users." };
        }

        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(200).send(courseApplications);

    } catch (err) {

        console.error("DegreeCoursesRoute: router.get('/:degreeCourseID/degreeCourseApplications') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// create a degree course
// only admin can do this!
router.post('/', isAuthenticated, async function (req, res, next) {
    try {
        const isAdmin = req.tokenData.isAdministrator;
        let degreeCourse = null;

        if (isAdmin) {
            // retrieve degree course and directly map the '_id' to 'id'
            degreeCourse = mapId((await DegreeCourseService.createDegreeCourse(req.body)).toJSON(), false);
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to create other degree courses." };
        }

        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(201).send(degreeCourse);

    } catch (err) {
        console.error("DegreeCoursesRoute: router.post('/') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// find and get one degree course:
router.get('/:degreeCourseID', async function (req, res, next) {
    try {
        const degreeCourse = mapId((await DegreeCourseService.findDegreeCourseByID(req.params.degreeCourseID)).toJSON(), false);

        res.status(200).send(degreeCourse);

    } catch (err) {

        console.error("DegreeCourseRoute: router.get('/:degreeCourseID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// update degreeCourse:
// only admin can do this!
router.put('/:degreeCourseID', isAuthenticated, async function (req, res, next) {
    try {
        const isAdmin = req.tokenData.isAdministrator;
        let degreeCourse = null;

        if (isAdmin) {
            degreeCourse = mapId((await DegreeCourseService.updateDegreeCourse(req.params.degreeCourseID, req.body)).toJSON());
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to update information of degree courses." };
        }
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(200).send(degreeCourse);

    } catch (err) {

        console.error("DegreeCourseRoute: router.put('/:degreeCourseID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

// delete degreeCourse:
// only admin can do this!
router.delete('/:degreeCourseID', isAuthenticated, async function (req, res, next) {
    try {
        const isAdmin = req.tokenData.isAdministrator;

        if (isAdmin) {
            await DegreeCourseService.deleteDegreeCourse(req.params.degreeCourseID);
        }
        else {
            throw { name: "AuthorizationError", message: "User is not authorized to delete degree courses." };
        }
        res.header('Authorization', 'Bearer ' + req.tokenData.token);
        res.status(204).send("Deleted degree course with ID: " + req.params.degreeCourseID);

    } catch (err) {

        console.error("DegreeCourseRoute: router.delete('/:degreeCourseID') Error: " + err.name, err);
        handleErrors(res, err);
    }
});

module.exports = router;