import React, { useState } from "react";
import TopMenu from "../NavComponents/TopMenu";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DegreeCourseComponent from '../DegreeCourseComponents/DegreeCourseComponent';
import CreateDegreeCoursePage from './CreateDegreeCoursePage';
import EditDegreeCoursePage from "./EditDegreeCoursePage";
import CreateCourseApplicationPage from "../CourseApplicationComponents/CreateCourseApplicationPage";
import { Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { deleteDegreeCourse } from "../../reducer/DegreeCourseManagementSlice";

function DegreeCourseManagementPage() {

    console.log('DegreeCourseManagementPage rendered');
    const dispatch = useDispatch();

    const [currentDegreeCourse, setCurrentDegreeCourse] = useState(undefined);
    const [showCreatePage, setShowCreatePage] = useState(false);
    const [showEditPage, setShowEditPage] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showCreateCourseApplicationPage, setShowCreateCourseApplicationPage] = useState(false);
    const degreeCourses = useSelector((state) => state.degreeCourseManagement.degreeCourses);
    const accessToken = useSelector((state) => state.login.accessToken);
    const user = useSelector((state) => state.login.user);
    let isAdmin = false;

    if (user) {
        isAdmin = user.isAdministrator;
    }

    return (
        <div id="DegreeCourseManagementPage">
            <div>
                {!showCreatePage && !showEditPage && !showCreateCourseApplicationPage ? (
                    <div id="DegreeCourseManagementPageListComponent">
                        <TopMenu />
                        <h3>Degree Course Management</h3>
                        {isAdmin ?
                            (
                                <div>
                                    <Button
                                        id="DegreeCourseManagementPageCreateDegreeCourseButton"
                                        onClick={() => setShowCreatePage(true)}
                                        variant="success"
                                    >
                                        Add Degree Course
                                    </Button>
                                    <br />
                                </div>
                            ) : null
                        }
                        <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {degreeCourses ? (
                                degreeCourses.map((degreeCourse) => (
                                    <DegreeCourseComponent
                                        key={degreeCourse.id}
                                        degreeCourse={degreeCourse}
                                        setCurrentDegreeCourse={setCurrentDegreeCourse}
                                        setShowEditPage={setShowEditPage}
                                        setShowDelete={setShowDelete}
                                        setShowCreateCourseApplicationPage={setShowCreateCourseApplicationPage}
                                    />
                                ))
                            ) : (
                                <div>
                                    <p>...Loading</p>
                                </div>
                            )}
                        </Container>
                    </div>
                ) : null}

            </div>
            <div>
                {showCreatePage ? (
                    <CreateDegreeCoursePage setShowCreatePage={setShowCreatePage} />
                ) : showEditPage ? (
                    <EditDegreeCoursePage degreeCourse={currentDegreeCourse} setShowEditPage={setShowEditPage} />
                ) : showCreateCourseApplicationPage ? (
                    <CreateCourseApplicationPage degreeCourse={currentDegreeCourse} setShowCreateCourseApplicationPage={setShowCreateCourseApplicationPage} />
                ) : null}
            </div>
            <div>
                {currentDegreeCourse ? (
                    <Modal
                        id={'DeleteDialogDegreeCourse' + currentDegreeCourse.id}
                        show={showDelete}
                        onHide={() => setShowDelete(false)}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Delete degree course{': '}
                                {currentDegreeCourse.shortName && currentDegreeCourse.name
                                    ? currentDegreeCourse.shortName + ' ' + currentDegreeCourse.name
                                    : currentDegreeCourse.name ? currentDegreeCourse.name : currentDegreeCourse.id}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                Do you really want to delete the degree course{': '}
                                {currentDegreeCourse.shortName && currentDegreeCourse.name
                                    ? currentDegreeCourse.shortName + ' ' + currentDegreeCourse.name
                                    : currentDegreeCourse.name ? currentDegreeCourse.name : currentDegreeCourse.id}?
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
                                    dispatch(deleteDegreeCourse({ accessToken, id: currentDegreeCourse.id }))
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

export default DegreeCourseManagementPage;
