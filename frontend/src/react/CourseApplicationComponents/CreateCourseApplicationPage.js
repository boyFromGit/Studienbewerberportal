import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TopMenu from "../NavComponents/TopMenu";
import { Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { createCourseApplication } from "../../reducer/CourseApplicationManagementSlice";

function CreateCourseApplicationPage({ degreeCourse, setShowCreateCourseApplicationPage }) {

    console.log('CreateDegreeCoursePage rendered');

    const dispatch = useDispatch();
    const user = useSelector((state) => state.login.user);
    const accessToken = useSelector((state) => state.login.accessToken);
    let isAdmin = false;

    if (user) {
        isAdmin = user.isAdministrator;
    }

    const [courseApplicationData, setCourseApplicationData] = useState({
        applicantUserID: user.userID,
        degreeCourseID: degreeCourse.id,
        targetPeriodYear: "",
        targetPeriodShortName: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseApplicationData((prevCourseApplicationData) => ({
            ...prevCourseApplicationData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(courseApplicationData);
            const actionResult = await dispatch(createCourseApplication({ accessToken, courseApplicationData }));

            // Check if the action was fulfilled
            if (createCourseApplication.fulfilled.match(actionResult)) {
                console.log('courseApplication creation successful');
                setShowCreateCourseApplicationPage(false);
            } else if (createCourseApplication.rejected.match(actionResult)) {
                console.log('courseApplication creation failed:', actionResult.error);
            }
        } catch (error) {
            console.error("CreateCourseApplicationPage: ", error);
        }
    };

    const handleCancel = () => {
        setShowCreateCourseApplicationPage(false);
    }

    return (
        <div>
            <TopMenu setShowCreateCourseApplicationPage={setShowCreateCourseApplicationPage} />
            <div id={"CreateDegreeCourseApplicationForDegreeCourse" + courseApplicationData.degreeCourseID}>
                <h3 style={{ marginBottom: '50px' }}>Creating Course Application</h3>
                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Degree Course Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control type="text" value={degreeCourse.name} name="degreeCourse" disabled={true} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">User ID</Form.Label>
                    {isAdmin ?
                        (
                            <Col md={2} className="mx-auto">
                                <Form.Control id="CreateDegreeCourseApplicationEditUserID" type="text" placeholder="UserID" name="applicantUserID" onChange={(e) => handleChange(e)} />
                            </Col>
                        ) :
                        (
                            <Col md={2} className="mx-auto">
                                <Form.Control id="CreateDegreeCourseApplicationEditUserID" type="text" value={user.userID} name="applicantUserID" disabled={true} />
                            </Col>
                        )
                    }
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Year</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateDegreeCourseApplicationEditTargetPeriodYear" type="text" placeholder="Year" name="targetPeriodYear" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Semester</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Select id="CreateDegreeCourseApplicationEditTargetPeriodName" name="targetPeriodShortName" onChange={(e) => handleChange(e)}>
                            <option>Please choose a semester</option>
                            <option value="WiSe">Wintersemsester</option>
                            <option value="SoSe">Summersemester</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                <Button style={{marginRight: '20px'}} id='CreateDegreeCourseApplicationCreateButton' type="submit" onClick={handleSubmit} variant="success">Create</Button>
                <Button variant="warning" onClick={handleCancel}>Cancel</Button>
            </div>
        </div>
    );
}

export default CreateCourseApplicationPage;