import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from "react-redux";

function CourseApplicationComponent({ courseApplication, setCurrentCourseApplication, setShowDelete, setCurrentDegreeCourse, setShowEdit }) {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.login.user);
    const allDegreeCourses = useSelector((state) => state.degreeCourseManagement.degreeCourses);
    const currentDegreeCourseID = courseApplication.degreeCourseID;
    const currentDegreeCourse = allDegreeCourses.find(degreeCourse => degreeCourse.id === currentDegreeCourseID);

    const applicantUserID = courseApplication.applicantUserID;
    const degreeCourseName = currentDegreeCourse.name;
    const universityShortName = currentDegreeCourse.universityShortName;
    const targetPeriodYear = courseApplication.targetPeriodYear;
    const targetPeriodShortName = courseApplication.targetPeriodShortName;
    const departmentName = currentDegreeCourse.departmentName;
    const displayName = `${applicantUserID}: ${universityShortName} | ${targetPeriodShortName} | ${targetPeriodYear}`;

    let isAdmin = false;

    if (user) {
        isAdmin = user.isAdministrator;
    }

    const handleShowDelete = () => {

        setCurrentDegreeCourse(currentDegreeCourse);
        setCurrentCourseApplication(courseApplication);
        setShowDelete(true);
    }

    const handleShowEdit = () => {

        setCurrentDegreeCourse(currentDegreeCourse);
        setCurrentCourseApplication(courseApplication);
        setShowEdit(true);
    }

    return (

        <Card
            id={`DegreeCourseApplicationItem${courseApplication.id}`}
            style={{
                maxWidth: '20rem',
                margin: '10px',
            }}
            className="card text-white bg-primary mb-3" >
            <Card.Header>{displayName}</Card.Header>
            <Card.Body>
                <Card.Text id="ApplicantUserID">
                    User: {applicantUserID}
                </Card.Text>
                <hr />
                <Card.Text id="DegreeCourseName">
                    Degree Course: {degreeCourseName}
                </Card.Text>
                <hr />
                <Card.Text id="TargetPeriodYear">
                    Application Year: {targetPeriodYear}
                </Card.Text>
                <hr />
                <Card.Text id="TargetPeriodShortName">
                    Application Semester: {targetPeriodShortName}
                </Card.Text>
                <hr />
                <Card.Text id="UniversityShortName">
                    University: {universityShortName}
                </Card.Text>
                <hr />
                <Card.Text>
                    Department: {departmentName}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                {isAdmin ?
                    (
                        <div>
                            <Button id={`DegreeCourseApplicationItemEditButton${courseApplication.id}`} style={{marginRight: '5px'}} variant="outline-warning" onClick={handleShowEdit}>Edit</Button>
                            <Button id={`DegreeCourseApplicationItemDeleteButton${courseApplication.id}`} variant="outline-danger" onClick={handleShowDelete}>Delete</Button>
                        </div>
                    ) :
                    (
                        <Button id={`DegreeCourseApplicationItemDeleteButton${courseApplication.id}`} variant="outline-danger" onClick={handleShowDelete}>Delete</Button>
                    )
                }
            </Card.Footer>
        </Card >
    );
}

export default CourseApplicationComponent;