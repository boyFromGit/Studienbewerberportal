import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import { Col } from "react-bootstrap";
import TopMenu from "../NavComponents/TopMenu";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useSelector, useDispatch } from "react-redux";
import { editCourseApplication } from "../../reducer/CourseApplicationManagementSlice";

function EditCourseApplicationPage({ courseApplication, degreeCourse, setShowEdit }) {

    console.log('EditCourseApplicationPage rendered');

    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.login.accessToken);
    const [showAlert, setShowAlert] = useState(false);

    const [courseApplicationData, setCourseApplicationData] = useState({
        id: "",
        applicantUserID: "",
        targetPeriodYear: "",
        targetPeriodShortName: ""
    });

    useEffect(() => {
        console.log('EditCourseApplicationPage: useEffect')
        if (courseApplication) {
            setCourseApplicationData({
                id: courseApplication.id,
                applicantUserID: courseApplication.applicantUserID,
                targetPeriodYear: courseApplication.targetPeriodYear || "",
                targetPeriodShortName: courseApplication.targetPeriodShortName || "",

            });
        }
    }, [courseApplication]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name);
        console.log(value);
        setCourseApplicationData((prevCourseApplicationData) => ({
            ...prevCourseApplicationData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const actionResult = await dispatch(editCourseApplication({ accessToken, courseApplicationData }));

            // Check if the action was fulfilled
            if (editCourseApplication.fulfilled.match(actionResult)) {
                console.log('edit course application successful');
                setShowAlert(true);
            } else if (editCourseApplication.rejected.match(actionResult)) {
                console.log('edit course application failed:', actionResult.error);
            }
        } catch (error) {
            console.error("EditCourseApplicationPage: ", error);
        }
    };

    const handleCancel = () => {
        setCourseApplicationData(undefined);
        setShowEdit(false);
        setShowAlert(false);
    }

    return (
        <div>
            <TopMenu setShowEditCourseApplicationPage={setShowEdit} />
            <div>
                <h3 style={{ marginBottom: '50px' }}>Editing Course Application</h3>
                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">User ID</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control type="text" value={courseApplicationData.applicantUserID} name="applicantUserID" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Degree Course</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control type="text" value={degreeCourse.name} name="name" disabled={true} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Application Year</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control type="text" value={courseApplicationData.targetPeriodYear} name="targetPeriodYear" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Semester</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Select name="targetPeriodShortName" value={courseApplicationData.targetPeriodShortName} onChange={(e) => handleChange(e)}>
                            <option value="WiSe">WiSe</option>
                            <option value="SoSe">SoSe</option>
                        </Form.Select>
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">University</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control type="text" value={degreeCourse.universityShortName} name="universityShortName" disabled={true} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Department</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control type="text" value={degreeCourse.departmentName} name="departmentName" disabled={true} />
                    </Col>
                </Form.Group>

                <Button style={{ marginRight: '20px' }} type="submit" onClick={handleSubmit} variant="success">Save</Button>
                <Button variant="warning" onClick={handleCancel}>Cancel</Button>

                {showAlert ?
                    (
                        <Alert className="mx-auto" style={{marginTop: '10px', maxWidth: '20rem'}} variant={'success'}>
                            Course Application got saved!
                        </Alert>
                    ) : null
                }
            </div>
        </div>
    );
}

export default EditCourseApplicationPage;