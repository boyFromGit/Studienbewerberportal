import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import TopMenu from "../NavComponents/TopMenu";
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { editUser } from "../../reducer/UserManagementSlice";

function EditUserPage({ user, setShowEditPage }) {

    const dispatch = useDispatch();
    const accessToken = useSelector((state) => state.login.accessToken);
    const [showAlert, setShowAlert] = useState(false);

    const [userData, setUserData] = useState({
        userID: "",
        firstName: "",
        lastName: "",
        password: "",
        isAdministrator: false,
    });

    console.log('EditUserPage rendered');

    // Update userData when the user prop changes and provide default values if some properties are empty (e.g. password will always be)
    useEffect(() => {
        console.log('EditUserPage: useEffect')
        if (user) {
            setUserData({
                userID: user.userID || "",
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                password: user.password || "",
                isAdministrator: user.isAdministrator || false,
            });
        }
    }, [user]); // if user prop changed --> useEffect()

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
            const actionResult = await dispatch(editUser({ accessToken, userData }));

            // Check if the action was fulfilled
            if (editUser.fulfilled.match(actionResult)) {
                console.log('edit user successful');
                setShowAlert(true);
            } else if (editUser.rejected.match(actionResult)) {
                console.log('edit user failed:', actionResult.error);
            }
        } catch (error) {
            console.error("EditUserPage: ", error);
        }
    };

    const handleBack = () => {

        setUserData(undefined);
        setShowEditPage(false);
        setShowAlert(false);
    }

    return (
        <div>
            <TopMenu setShowEditUserPage={setShowEditPage} />
            <div id="UserManagementPageEditComponent">
                <h3 style={{ marginBottom: '50px' }}>Editing User</h3>
                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">User-ID</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="EditUserComponentEditUserID" type="text" value={userData.userID} name="userID" disabled={true} />
                        <Form.Text>
                            Your User-ID can not be changed.
                        </Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">First Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="EditUserComponentEditFirstName" type="text" value={userData.firstName} name="firstName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Last Name</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="EditUserComponentEditLastName" type="text" value={userData.lastName} name="lastName" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start col-md-2">Password</Form.Label>
                    <Col md={2} className="mx-auto">
                        <Form.Control id="EditUserComponentEditPassword" type="password" value={userData.password} placeholder="Password" name="password" onChange={(e) => handleChange(e)} />
                    </Col>
                </Form.Group>

                <Form.Group className="mb-3 d-flex align-items-center justify-content-center">
                    <Form.Check id='EditUserComponentEditIsAdministrator“' type="checkbox" checked={userData.isAdministrator} name="isAdministrator" onChange={(e) => handleChange(e)} />
                    <Form.Label className="text-start me-2" style={{ margin: '10px' }}>Administrator Rights</Form.Label>
                </Form.Group>

                <Button id='EditUserComponentSaveUserButton' style={{ marginRight: '20px' }} type="submit" onClick={handleSubmit} variant="success">Save</Button>
                <Button id='OpenUserManagementPageListComponentButton' type="button" onClick={handleBack} variant="warning">Cancel</Button>
                {showAlert ?
                    (
                        <Alert className="mx-auto" style={{marginTop: '10px', maxWidth: '20rem'}} variant={'success'}>
                            User got saved!
                        </Alert>
                    ) : null
                }

            </div>
        </div>
    );
}

export default EditUserPage;