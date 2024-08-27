import React, { useState } from "react";
import TopMenu from "../NavComponents/TopMenu";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container } from "react-bootstrap";
import CourseApplicationComponent from "./CourseApplicationComponent";
import EditCourseApplicationPage from './EditCourseApplicationPage';
import { useSelector, useDispatch } from "react-redux";
import { deleteCourseApplication } from "../../reducer/CourseApplicationManagementSlice";


function CourseApplicationManagementPage() {

    console.log('CourseApplicationManagementPage rendered');
    const dispatch = useDispatch();

    const [showDelete, setShowDelete] = useState(false);
    const [currentCourseApplication, setCurrentCourseApplication] = useState(undefined);
    const [currentDegreeCourse, setCurrentDegreeCourse] = useState(undefined);
    const [showEdit, setShowEdit] = useState(false);
    const courseApplications = useSelector((state) => state.courseApplicationManagement.courseApplications);
    const accessToken = useSelector((state) => state.login.accessToken);

    return (
        <div id="DegreeCourseApplicationManagementPage">
            <div className="page-content">
                {!showEdit ?
                    (
                        <div id="DegreeCourseApplicationManagementPageListComponent">
                            <TopMenu />
                            <h3>Course Application Management</h3>
                            <br />
                            <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {courseApplications ? (
                                    courseApplications.map((courseApplication) => (
                                        <CourseApplicationComponent
                                            key={courseApplication.id}
                                            courseApplication={courseApplication}
                                            setCurrentCourseApplication={setCurrentCourseApplication}
                                            setShowDelete={setShowDelete}
                                            setCurrentDegreeCourse={setCurrentDegreeCourse}
                                            setShowEdit={setShowEdit}
                                        />
                                    ))
                                ) : (
                                    <div>
                                        <p>...Loading</p>
                                    </div>
                                )}
                            </Container>
                        </div>
                    ) : null
                }
            </div>
            <div>
                {showEdit ?
                    (
                        <EditCourseApplicationPage courseApplication={currentCourseApplication} degreeCourse={currentDegreeCourse} setShowEdit={setShowEdit} />
                    ) : null
                }
            </div>
            <div>
                {currentCourseApplication ? (
                    <Modal
                        id={'DeleteDialogDegreeCourseApplication' + currentCourseApplication.id}
                        show={showDelete}
                        onHide={() => setShowDelete(false)}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Delete course application of{': '}
                                {currentCourseApplication.applicantUserID}?
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                Do you really want to delete the course application of
                                {' \'' + currentCourseApplication.applicantUserID + '\'' + ' for the degree course ' + currentDegreeCourse.name + ' in '
                                    + currentCourseApplication.targetPeriodYear + ' (' + currentCourseApplication.targetPeriodShortName + ')'}?
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                id='DeleteDialogCancelButton'
                                variant="secondary"
                                onClick={() => setShowDelete(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                id='DeleteDialogConfirmButton'
                                variant="primary"
                                onClick={() => {
                                    dispatch(deleteCourseApplication({ accessToken, id: currentCourseApplication.id }))
                                    setShowDelete(false);
                                }}
                            >
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                ) : null}
            </div>
        </div>
    );
}

export default CourseApplicationManagementPage;
