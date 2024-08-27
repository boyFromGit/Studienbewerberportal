import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Col } from "react-bootstrap";
import TopMenu from "../NavComponents/TopMenu";
import { useSelector, useDispatch } from "react-redux";
import { createDegreeCourse } from "../../reducer/DegreeCourseManagementSlice";

function CreateDegreeCoursePage({ setShowCreatePage }) {

    console.log('CreateDegreeCoursePage rendered');

    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.login.accessToken);

    const [degreeCourseData, setDegreeCourseData] = useState({
        name: "",
        shortName: "",
        universityName: "",
        universityShortName: "",
        departementName: "",
        departementShortName: ""
    });

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
            const actionResult = await dispatch(createDegreeCourse({ accessToken, degreeCourseData }));

            // Check if the action was fulfilled
            if (createDegreeCourse.fulfilled.match(actionResult)) {
                console.log('DegreeCourse creation successful');
                setShowCreatePage(false);
            } else if (createDegreeCourse.rejected.match(actionResult)) {
                console.log('DegreeCourse creation failed:', actionResult.error);
            }
        } catch (error) {
            console.error("CreateDegreeCoursePage: ", error);
        }
    };

    const handleBack = () => {
        setDegreeCourseData(undefined);
        setShowCreatePage(false);
    }

    return (
        <div>
            <TopMenu setShowCreateDegreeCoursePage={setShowCreatePage} />
            <div id="DegreeCourseManagementPageCreateComponent">
                <h3 style={{ marginBottom: '50px' }}>Creating Degree Course</h3>
                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Degree Course Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateDegreeCourseComponentEditName" type="text" placeholder="Please enter degree course name" name="name" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Degree Course Short Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateDegreeCourseComponentEditShortName" type="text" placeholder="Please enter degree course short name" name="shortName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">University Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateDegreeCourseComponentEditUniversityName" type="text" placeholder="Please enter university name" name="universityName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">University Short Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateDegreeCourseComponentEditUniversityShortName" type="text" placeholder="Please enter university short name" name="universityShortName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Departement Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateDegreeCourseComponentEditDepartmentName" type="text" placeholder="Please enter department name" name="departementName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Departement Short Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateDegreeCourseComponentEditDepartmentShortName" type="text" placeholder="Please enter department short name" name="departementShortName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Button style={{marginRight: '20px'}} id='CreateDegreeCourseComponentCreateDegreeCourseButton' type="submit" onClick={handleSubmit} variant="success">Create</Button>
                <Button id='OpenDegreeCourseManagementPageListComponentButton' type="submit" onClick={handleBack} variant="warning">Cancel</Button>
            </div>
        </div>
    );
}

export default CreateDegreeCoursePage;