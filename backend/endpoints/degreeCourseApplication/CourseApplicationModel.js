const mongoose = require("mongoose");

const semester = ['WiSe', 'SoSe'];

const courseApplicationSchema = new mongoose.Schema({

    applicantUserID: { type: String, required: true }, // wird über den token bestimmt
    degreeCourseID: { type: String, required: true },
    targetPeriodYear: { type: Number, required: true },
    targetPeriodShortName: { type: String, required: true, enum: semester }
});

const CourseApplicationModel = mongoose.model("degree_course_application", courseApplicationSchema);

module.exports = CourseApplicationModel;