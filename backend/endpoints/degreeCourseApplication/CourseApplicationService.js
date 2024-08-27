const CourseApplication = require("./CourseApplicationModel");
const DegreeCourseService = require('../degreeCourse/DegreeCourseService');
const UserService = require('../user/UserService');

// returns applications dependent on the query
async function findCourseApplications(query) {
    try {
        const courseApplications = await CourseApplication.find(query).exec();

        if (courseApplications) {
            return courseApplications;
        }
        else {
            throw { name: 'DataError', message: "Degree course applications could not be retrieved." }
        }
    }
    catch (err) {
        throw err;
    }
}

// returns all applications of a specific user
async function getCourseApplications(userID) {
    try {
        const courseApplications = await CourseApplication.find({ applicantUserID: userID }).exec();

        if (courseApplications) {
            return courseApplications;
        }
        else {
            throw { name: 'DataError', message: "Degree course applications could not be retrieved." }
        }
    }
    catch (err) {
        throw err;
    }
}

// creates application
async function createCourseApplication(courseApplication) {
    try {
        const { degreeCourseID, applicantUserID, targetPeriodYear, targetPeriodShortName } = courseApplication;

        // check if the user exists
        await UserService.findUserByID(applicantUserID);

        // check if the degreeCourseID provided is valid or if the course even exists
        await DegreeCourseService.findDegreeCourseByID(degreeCourseID);

        // check if there is already an application for this course and year
        const existingApplication = await CourseApplication.findOne({ applicantUserID: applicantUserID, degreeCourseID: degreeCourseID, targetPeriodYear: targetPeriodYear, targetPeriodShortName: targetPeriodShortName });

        if (existingApplication) {
            throw { name: 'DataError', message: "There is already an application for this degree course in " + targetPeriodYear + "." };
        }

        const newCourseApplication = await CourseApplication.create(courseApplication);

        if (newCourseApplication) {
            return newCourseApplication;
        }
        else {
            throw { name: 'DataError', message: "Degree course application could not be created." };
        }
    } catch (err) {
        // if the provided degreeCourseID is not in a valid format mongoose will throw a 'CastError', which basically means the course can not exist
        if (err.name === "CastError") {
            throw { name: 'DataError', message: "The ID: '" + courseApplication.degreeCourseID + "' is not a valid degree course ID." };
        }
        throw err;
    }
}

async function updateCourseApplication(applicationID, body) {
    try {
        let courseApplication = await CourseApplication.findById(applicationID);
        if (!courseApplication) {
            throw { name: 'NotFoundError', message: "Degree course application with the ID: '" + applicationID + "' could not be found." };
        }

        const { targetPeriodYear, targetPeriodShortName } = body;

        if (targetPeriodYear) courseApplication.targetPeriodYear = targetPeriodYear;
        if (targetPeriodShortName) courseApplication.targetPeriodShortName = targetPeriodShortName;

        // check if the application already exists for this course and year:
        const existingApplication = await CourseApplication.findOne({
            applicantUserID: courseApplication.applicantUserID, degreeCourseID: courseApplication.degreeCourseID,
            targetPeriodYear: courseApplication.targetPeriodYear, targetPeriodShortName: courseApplication.targetPeriodShortName
        });

        if (existingApplication) {
            throw { name: 'DataError', message: "There is already an application for this degree course in " + courseApplication.targetPeriodYear + "." };
        }

        await courseApplication.save();
        return courseApplication;
    }
    catch (err) {
        throw err;
    }
}

async function deleteCourseApplication(applicationID, isAdmin, userID) {
    try {
        const courseApplication = await CourseApplication.findById(applicationID);

        if (!courseApplication) {
            throw { name: 'NotFoundError', message: "Degree course application with the ID: '" + applicationID + "' could not be found." };
        }

        if (isAdmin || userID === courseApplication.applicantUserID) {
            await CourseApplication.deleteOne({ _id: applicationID }).exec();
        }
        else {
            throw { name: 'AuthorizationError', message: "User is not authorized to delete applications of other users."}
        }
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    findCourseApplications,
    getCourseApplications,
    createCourseApplication,
    updateCourseApplication,
    deleteCourseApplication
}