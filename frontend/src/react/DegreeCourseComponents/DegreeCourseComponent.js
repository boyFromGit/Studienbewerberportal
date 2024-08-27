import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from "react-redux";

function DegreeCourseComponent({ degreeCourse, setCurrentDegreeCourse, setShowEditPage, setShowDelete, setShowCreateCourseApplicationPage }) {

    const dispatch = useDispatch();

    const name = degreeCourse.name;
    const shortName = degreeCourse.shortName;
    const universityName = degreeCourse.universityName;
    const departmentName = degreeCourse.departmentName;
    const displayName = shortName ? `${shortName}: ${name}` : name;
    const user = useSelector((state) => state.login.user);

    let isAdmin = false;

    if (user) {
        isAdmin = user.isAdministrator;
    }

    const handleShowEdit = () => {

        setCurrentDegreeCourse(degreeCourse);
        setShowEditPage(true);
    }

    const handleShowDelete = () => {

        setCurrentDegreeCourse(degreeCourse);
        setShowDelete(true);
    }

    const handleShowCreateCourseApplicationPage = () => {

        setCurrentDegreeCourse(degreeCourse);
        setShowCreateCourseApplicationPage(true);
    }

    return (
        <Card
            id={`DegreeCourseItem${degreeCourse.id}`}
            style={{
                maxWidth: '21rem',
                margin: '10px',
            }}
            className="card text-white bg-primary mb-3" >
            <Card.Header>{displayName}</Card.Header>
            <Card.Body>
                <Card.Text id="UniversityName">
                    University: {universityName}
                </Card.Text>
                <hr />
                <Card.Text id="DepartmentName">
                    Department: {departmentName}
                </Card.Text>
                <hr />
                <Card.Text id="Name">
                    Degree Course: {name}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                {isAdmin ?
                    (
                        <div>
                            <Button id={`CreateDegreeCourseApplicationForDegreeCourse${degreeCourse.id}`} onClick={handleShowCreateCourseApplicationPage} variant="outline-success">Create Application</Button>
                            <Button id={`DegreeCourseItemEditButton${degreeCourse.id}`} variant="outline-warning" style={{margin: '0px 5px 0px 5px'}} onClick={handleShowEdit}> Edit </Button>
                            <Button id={`DegreeCourseItemDeleteButton${degreeCourse.id}`} variant="outline-danger" onClick={handleShowDelete}>Delete</Button>
                        </div>
                    ) :
                    (
                        <Button id={`CreateDegreeCourseApplicationForDegreeCourse${degreeCourse.id}`} onClick={handleShowCreateCourseApplicationPage} variant="success">Create Application</Button>
                    )
                }
            </Card.Footer>
        </Card >
    );
}

export default DegreeCourseComponent;