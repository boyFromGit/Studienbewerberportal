const mongoose = require("mongoose");

const degreeCourseSchema = new mongoose.Schema({

    name: { type: String },
    shortName: { type: String },
    universityName: { type: String },
    universityShortName: { type: String },
    departmentName: { type: String },
    departmentShortName: { type: String }
});

const DegreeCourseModel = mongoose.model("degree_courses", degreeCourseSchema);

module.exports = DegreeCourseModel;