import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import { Col } from "react-bootstrap";
import TopMenu from "../NavComponents/TopMenu";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useSelector, useDispatch } from "react-redux";
import { editDegreeCourse } from "../../reducer/DegreeCourseManagementSlice";

function EditDegreeCoursePage({ degreeCourse, setShowEditPage }) {

    console.log('EditDegreeCoursePage rendered');

    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.login.accessToken);
    const [showAlert, setShowAlert] = useState(false);

    const [degreeCourseData, setDegreeCourseData] = useState({
        id: "",
        name: "",
        shortName: "",
        universityName: "",
        universityShortName: "",
        departmentName: "",
        departmentShortName: ""
    });

    useEffect(() => {
        console.log('EditDegreeCoursePage: useEffect')
        if (degreeCourse) {
            setDegreeCourseData({
                id: degreeCourse.id,
                name: degreeCourse.name || "",
                shortName: degreeCourse.shortName || "",
                universityName: degreeCourse.universityName || "",
                universityShortName: degreeCourse.universityShortName || "",
                departmentName: degreeCourse.departmentName || "",
                departmentShortName: degreeCourse.departmentShortName || ""
            });
        }
    }, [degreeCourse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDegreeCourseData((prevDegreeCourseData) => ({
            ...prevDegreeCourseData,
            [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const actionResult = await dispatch(editDegreeCourse({ accessToken, degreeCourseData }));

            // Check if the action was fulfilled
            if (editDegreeCourse.fulfilled.match(actionResult)) {
                console.log('edit degree course successful');
                setShowAlert(true);
            } else if (editDegreeCourse.rejected.match(actionResult)) {
                console.log('edit degree course failed:', actionResult.error);
            }
        } catch (error) {
            console.error("EditDegreeCoursePage: ", error);
        }
    };

    const handleBack = () => {
        setDegreeCourseData(undefined);
        setShowEditPage(false);
        setShowAlert(false);
    }

    return (
        <Form>
            <TopMenu setShowEditDegreeCoursePage={setShowEditPage} />
            <div id="DegreeCourseManagementPageEditComponent">
                <h3 style={{ marginBottom: '50px' }}>Editing Degree Course</h3>
                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Degree Course Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control style={{ maxWidth: '500px' }} id="EditDegreeCourseComponentEditName" type="text" value={degreeCourseData.name} name="name" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Degree Course Short Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control className="mx-auto" style={{ maxWidth: '500px' }} id="EditDegreeCourseComponentEditShortName" type="text" value={degreeCourseData.shortName} name="shortName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">University Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="EditDegreeCourseComponentEditUniversityName" type="text" value={degreeCourseData.universityName} name="universityName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">University Short Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="EditDegreeCourseComponentEditUniversityShortName" type="text" value={degreeCourseData.universityShortName} name="universityShortName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Department Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="EditDegreeCourseComponentEditDepartmentName" type="text" value={degreeCourseData.departmentName} name="departmentName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Department Short Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="EditDegreeCourseComponentEditDepartmentShortName" type="text" value={degreeCourseData.departmentShortName} name="departmentShortName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Button style={{marginRight: '20px'}} id='EditDegreeCourseComponentSaveDegreeCourseButton' type="submit" onClick={handleSubmit} variant="success">Save</Button>
                <Button id='OpenDegreeCourseManagementPageListComponentButton' type="button" onClick={handleBack} variant="warning">Cancel</Button>
                {showAlert ?
                    (
                        <Alert className="mx-auto" style={{marginTop: '10px', maxWidth: '20rem'}} variant={'success'}>
                            Degree Course got saved!
                        </Alert>
                    ) : null
                }
            </div>
        </Form >
    );
}

export default EditDegreeCoursePage;