import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TopMenu from "../NavComponents/TopMenu";
import { Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { createUser } from "../../reducer/UserManagementSlice";

function CreateUserPage({ setShowCreatePage }) {

    console.log('CreateUserPage rendered');

    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.login.accessToken);

    const [userData, setUserData] = useState({
        userID: "",
        firstName: "",
        lastName: "",
        password: "",
        isAdministrator: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // If the input is a checkbox, update the state differently
        const newValue = type === 'checkbox' ? checked : value;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: newValue,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const actionResult = await dispatch(createUser({ accessToken, userData }));

            // Check if the action was fulfilled
            if (createUser.fulfilled.match(actionResult)) {
                console.log('User creation successful');
                setShowCreatePage(false);
            } else if (createUser.rejected.match(actionResult)) {
                console.log('User creation failed:', actionResult.error);
            }
        } catch (error) {
            console.error("CreateUserPage: ", error);
        }
    };

    const handleCancel = () => {
        setShowCreatePage(false);
    }

    return (
        <div>
            <TopMenu setShowCreateUserPage={setShowCreatePage} />
            <div id="UserManagementPageCreateComponent">
                <h3 style={{ marginBottom: '50px' }}>Creating User</h3>
                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">User-ID</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateUserComponentEditUserID" type="text" placeholder="User-ID required" name="userID" onChange={(e) => handleChange(e)} />
                        <Form.Text>
                            Your User-ID can not be changed afterwards.
                        </Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">First Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateUserComponentEditFirstName" type="text" placeholder="Please enter your first name" name="firstName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Last Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateUserComponentEditLastName" type="text" placeholder="Please enter your last name" name="lastName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Password</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="CreateUserComponentEditPassword" type="password" placeholder="Password required" name="password" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3 d-flex align-items-center justify-content-center">
                    <Form.Check id='CreateUserComponentEditIsAdministrator' type="checkbox" name="isAdministrator" onChange={(e) => handleChange(e)} />
                    <Form.Label className="text-start me-2" style={{margin: '10px'}}>Administrator Rights</Form.Label>
                </Form.Group>

                <Button id='CreateUserComponentCreateUserButton' type="submit" onClick={handleSubmit} variant="success">Create User</Button>
                <Button id='OpenUserManagementPageListComponentButton' type="submit" onClick={handleCancel} variant="warning">Cancel</Button>
            </div>
        </div>
    );
}

export default CreateUserPage;