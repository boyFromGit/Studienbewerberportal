import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import MySpinner from '../NavComponents/MySpinner';
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { handleShow, handleClose, handleChange, authenticateUser, handleLogout } from '../../reducer/LoginSlice';

function LoginButton() {

    const dispatch = useDispatch();
    const show = useSelector((state) => state.login.showLoginDialog);
    const loginPending = useSelector((state) => state.login.loginPending);
    const { userID, password } = useSelector((state) => state.login);
    const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch the async thunk
        dispatch(authenticateUser({ userID, password }));
    };

    // hier schauen wegen Logout Button und dem LandingPage ID Test
    return (
        <div>
            {!isLoggedIn ?
                (
                    <Button id="OpenLoginDialogButton" variant="btn btn-success" onClick={() => dispatch(handleShow())}>Login</Button>
                ) :
                (
                    <LinkContainer to="/" >
                        <Button id="LogoutButton" variant="btn btn-danger" onClick={() => dispatch(handleLogout())}>Logout</Button>
                    </LinkContainer>
                )
            }
            <Modal id="LoginDialog" show={show && !isLoggedIn} onHide={() => dispatch(handleClose())}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>User ID</Form.Label>
                            <Form.Control id="LoginDialogUserIDText" type="text" placeholder="Enter user ID" name='userID' onChange={(e) => dispatch(handleChange({ name: e.target.name, value: e.target.value }))} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control id="LoginDialogPasswordText" type="password" placeholder="Password" name='password' onChange={(e) => dispatch(handleChange({ name: e.target.name, value: e.target.value }))} />
                        </Form.Group>
                        <Button id="PerformLoginButton" disabled={loginPending} variant="primary" type="submit" onClick={handleSubmit}><MySpinner />{loginPending ? '' : 'Login'}</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    Forgot password?
                </Modal.Footer>
            </Modal>

        </div >
    );
}

export default LoginButton;