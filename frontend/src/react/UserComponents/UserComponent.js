import React from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from "react-redux";
// import { showEdit, showDelete } from "../reducer/UserManagementSlice";

function UserComponent({ user, setCurrentUser, setShowEditPage, setShowDelete }) {

    const userID = user.userID;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const fullName = firstName ? firstName + ' ' + lastName : userID;
    const editButtonID = 'UserItemEditButton' + userID;
    const deleteButtonID = 'UserItemDeleteButton' + userID;

    const id = 'UserItem' + user.userID;

    const handleShowEdit = () => {

        setCurrentUser(user);
        setShowEditPage(true);
    }

    const handleShowDelete = () => {

        setCurrentUser(user);
        setShowDelete(true);
    }

    return (
        <Card id={id}
            style={{
                maxWidth: '20rem',
                minWidth: '15rem',
                margin: '10px',
            }}
            className="card text-white bg-primary mb-3" >
            <Card.Header>{fullName}</Card.Header>
            <Card.Body>
                <Card.Text id={"UserID"}>
                    User ID: {userID}
                </Card.Text>
                <hr />
                <Card.Text id={"FirstName"}>
                    First Name: {firstName}
                </Card.Text>
                <hr />
                <Card.Text id={"LastName"}>
                    Last Name: {lastName}
                </Card.Text>
            </Card.Body>
            <Card.Footer>
                <Button id={editButtonID} onClick={handleShowEdit} style={{marginRight: '5px'}} variant="outline-warning"> Edit </Button>
                <Button id={deleteButtonID} onClick={handleShowDelete} variant="outline-danger">Delete</Button>
            </Card.Footer>
        </Card >
    );
}

export default UserComponent;