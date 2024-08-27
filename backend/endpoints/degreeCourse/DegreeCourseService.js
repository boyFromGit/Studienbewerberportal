const DegreeCourse = require("./DegreeCourseModel");

async function findDegreeCourses(query) {
    try {
        // query contains an object with the query attributes
        // example:
        // query = degreeCourses?universityShortName=test&name=hello
        // object = { universityShortName: "test", name: "hello" }
        // find returns every instance matching these attributes
        const degreeCourses = await DegreeCourse.find(query).exec();

        if (degreeCourses) {
            return degreeCourses;
        }
        else {
            throw { name: 'findDegreeCoursesError', message: "Degree Courses could not be retrieved." }
        }
    }
    catch (err) {
        throw err;
    }
}

async function createDegreeCourse(degreeCourse) {
    try {
        let newDegreeCourse = await DegreeCourse.create(degreeCourse);
        if (newDegreeCourse) {
            return newDegreeCourse;
        }
        else {
            throw { name: 'CreateDegreeCourseError', message: "Degree course could not be created." }
        }
    } catch (err) {
        throw err;
    }
}

async function findDegreeCourseByID(searchDegreeCourseID) {
    try {
        let degreeCourse = await DegreeCourse.findById(searchDegreeCourseID).exec();

        if (degreeCourse) {
            return degreeCourse;
        }
        else {
            throw { name: 'NotFoundError', message: "Degree course with the ID: '" + searchDegreeCourseID + "' could not be found." };
        }
    }
    catch (err) {
        throw err;
    }
}

async function updateDegreeCourse(searchDegreeCourseID, body) {
    try {
        let degreeCourse = await findDegreeCourseByID(searchDegreeCourseID);
        Object.assign(degreeCourse, body);
        await degreeCourse.save();
        return degreeCourse;
    }
    catch (err) {
        throw err;
    }
}

async function deleteDegreeCourse(searchDegreeCourseID) {
    try {
        // check if the degree course exists: if not throw error inside find function
        await findDegreeCourseByID(searchDegreeCourseID);
        console.log("deleting degree course")
        await DegreeCourse.deleteOne({ _id: searchDegreeCourseID }).exec();
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    findDegreeCourses,
    createDegreeCourse,
    findDegreeCourseByID,
    updateDegreeCourse,
    deleteDegreeCourse
}
