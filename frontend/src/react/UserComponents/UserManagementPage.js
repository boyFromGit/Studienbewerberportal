import React, { useState, useEffect, useRef } from "react";
import TopMenu from "../NavComponents/TopMenu";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UserComponent from "./UserComponent";
import CreateUserPage from "./CreateUserPage";
import EditUserPage from "./EditUserPage";
import Container from 'react-bootstrap/Container';
import { deleteUser } from "../../reducer/UserManagementSlice";
import { useSelector, useDispatch } from "react-redux";

function UserManagementPage() {
    console.log('UserManagementPage rendered');

    const dispatch = useDispatch();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showCreatePage, setShowCreatePage] = useState(false);
    const [showEditPage, setShowEditPage] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const users = useSelector((state) => state.userManagement.users);
    const accessToken = useSelector((state) => state.login.accessToken);
    const user = useSelector((state) => state.login.user);
    let isAdmin = false;

    if (user) {
        isAdmin = user.isAdministrator;
    }

    return (
        <div id="UserManagementPage">
            <div>
                {!showCreatePage && !showEditPage ? (
                    <div id="UserManagementPageListComponent">
                        <TopMenu />
                        <h3>User Management</h3>
                        <Button
                            id="UserManagementPageCreateUserButton"
                            onClick={() => setShowCreatePage(true)}
                            variant="success"
                        >
                            Add User
                        </Button>
                        <br />
                        <Container style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {users ? (
                                users.map((user) => (
                                    <UserComponent
                                        key={user.id}
                                        user={user}
                                        setCurrentUser={setCurrentUser}
                                        setShowEditPage={setShowEditPage}
                                        setShowDelete={setShowDelete}
                                    />
                                ))
                            ) : (
                                <p>...Loading</p>
                            )}
                        </Container>
                    </div>
                ) : null}
            </div>
            <div>
                {showCreatePage ? (
                    <CreateUserPage setShowCreatePage={setShowCreatePage} />
                ) : showEditPage ? (
                    <EditUserPage user={currentUser} setShowEditPage={setShowEditPage} />
                ) : null}
            </div>
            <div>
                {currentUser ? (
                    <Modal
                        id={'DeleteDialogUser' + currentUser.userID}
                        show={showDelete}
                        onHide={() => setShowDelete(false)}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Delete user{': '}
                                {currentUser.firstName && currentUser.lastName
                                    ? currentUser.firstName + ' ' + currentUser.lastName
                                    : currentUser.userID}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                Do you really want to delete the user{': '}
                                {currentUser.firstName && currentUser.lastName
                                    ? currentUser.firstName + ' ' + currentUser.lastName
                                    : currentUser.userID}?
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
                                    dispatch(deleteUser({ accessToken, userID: currentUser.userID }))
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

export default UserManagementPage;
