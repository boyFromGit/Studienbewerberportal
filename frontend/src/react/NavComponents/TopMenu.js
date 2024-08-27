import React, { useEffect } from "react";
import LoginButton from './LoginButton';
import imgDarkLightMode from '../../images/theme_light_dark_icon.png'
import my_logo from '../../images/my_logo.png'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUsers } from '../../reducer/UserManagementSlice';
import { fetchAllDegreeCourses } from "../../reducer/DegreeCourseManagementSlice";
import { fetchAllCourseApplications, fetchMyCourseApplications } from "../../reducer/CourseApplicationManagementSlice";
import { handleShowDarkMode, handleShowLightMode } from "../../reducer/LoginSlice";

function TopMenu({ setShowEditUserPage, setShowCreateUserPage, setShowEditDegreeCoursePage, setShowCreateDegreeCoursePage, 
    setShowCreateCourseApplicationPage, setShowEditCourseApplicationPage }) {

    const dispatch = useDispatch();

    const user = useSelector((state) => state.login.user);
    const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
    const accessToken = useSelector((state) => state.login.accessToken);
    const allDegreeCourses = useSelector((state) => state.degreeCourseManagement.degreeCourses);
    const showDarkMode = useSelector((state) => state.login.showDarkMode);

    let isAdmin = false;

    if (user) {
        isAdmin = user.isAdministrator;
    }

    useEffect(() => {
        console.log('useEffect showDark/Light -mode');
        // Dynamically switch between light and dark mode by changing the href of the stylesheet
        const linkElement = document.getElementById('theme-stylesheet');
        const darkModeStylesheet = '/themes/darkly/bootstrap.css';
        const lightModeStylesheet = '/themes/flatly/bootstrap.css';

        if (linkElement) {
            linkElement.href = showDarkMode ? darkModeStylesheet : lightModeStylesheet;
        }
    }, [showDarkMode]);

    const toggleDarkMode = () => {
        if (!showDarkMode) {
            dispatch(handleShowDarkMode());
        }
        else {
            dispatch(handleShowLightMode());
        }
    };

    const handleClose = () => {
        // Check if the functions are available before calling them
        if (setShowEditUserPage) {
            setShowEditUserPage(false);
        }
        if (setShowCreateUserPage) {
            setShowCreateUserPage(false);
        }
        if (setShowEditDegreeCoursePage) {
            setShowEditDegreeCoursePage(false);
        }
        if (setShowCreateDegreeCoursePage) {
            setShowCreateDegreeCoursePage(false);
        }
        if (setShowCreateCourseApplicationPage) {
            setShowCreateCourseApplicationPage(false);
        }
        if(setShowEditCourseApplicationPage){
            setShowEditCourseApplicationPage(false);
        }
    };

    const handleFetchUsersAndClose = () => {
        dispatch(fetchAllUsers({ accessToken }));
        handleClose();
    };

    const handleFetchDegreeCoursesAndClose = () => {
        dispatch(fetchAllDegreeCourses({ accessToken }));
        handleClose();
    };

    const handleFetchCourseApplicationsAndClose = () => {
        // fetch all degreeCourses first if they are empty
        if (!allDegreeCourses) {
            dispatch(fetchAllDegreeCourses({ accessToken }));
        }
        if (isAdmin) {
            dispatch(fetchAllCourseApplications({ accessToken }));
        }
        else {
            dispatch(fetchMyCourseApplications({ accessToken }));
        }
        handleClose();
    };

    return (

        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <LinkContainer to="/" className="navbar-brand ml-auto">
                    <div>
                        <img src={my_logo} alt="logo" style={{ maxWidth: '50px', height: 'auto', cursor: 'pointer' }} />
                        <span style={{ cursor: 'pointer' }}>Scholar Sphere</span>
                    </div>
                </LinkContainer>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <LoginButton/>
                    <ul className="navbar-nav me-auto">
                        {isAdmin ?
                            (
                                <div style={{display: 'inline-flex'}}>
                                    <li className="nav-item">
                                        <LinkContainer to="/" id="OpenStartPageButton">
                                            <button className="nav-link" onClick={handleClose}>Startpage</button>
                                        </LinkContainer>
                                    </li>
                                    <li className="nav-item">
                                        <LinkContainer to="/userManagement" id="OpenUserManagementPageButton">
                                            <button className="nav-link" onClick={handleFetchUsersAndClose}>User Management</button>
                                        </LinkContainer>
                                    </li>
                                    <li className="nav-item">
                                        <LinkContainer to="/degreeCourseManagement" id="OpenDegreeCourseManagementPageButton">
                                            <button className="nav-link" onClick={handleFetchDegreeCoursesAndClose}>Degree Course Management</button>
                                        </LinkContainer>
                                    </li>
                                    <li className="nav-item">
                                        <LinkContainer to="/courseApplicationManagement" id="OpenDegreeCourseApplicationManagementPageButton">
                                            <button className="nav-link" onClick={handleFetchCourseApplicationsAndClose}>Application Management</button>
                                        </LinkContainer>
                                    </li>
                                    <li className="nav-item">
                                        <img src={imgDarkLightMode} className="nav-link" alt="Dark Mode/ Light Mode"
                                            onClick={toggleDarkMode}
                                            style={{ maxWidth: '50px', height: 'auto', cursor: 'pointer', filter: `invert(${showDarkMode ? '0%' : '100%'})` }} />
                                    </li>
                                </div>
                            ) : isLoggedIn ?
                                (
                                    <div style={{ display: "inline-flex" }}>
                                        <li className="nav-item">
                                            <LinkContainer to="/" id="OpenStartPageButton">
                                                <button className="nav-link" onClick={handleClose}>Startpage</button>
                                            </LinkContainer>
                                        </li>
                                        <li className="nav-item">
                                            <LinkContainer to="/degreeCourseManagement" id="OpenDegreeCourseManagementPageButton">
                                                <button className="nav-link" onClick={handleFetchDegreeCoursesAndClose}>Degree Courses</button>
                                            </LinkContainer>
                                        </li>
                                        <li className="nav-item">
                                            <LinkContainer to="/courseApplicationManagement" id="OpenDegreeCourseApplicationManagementPageButton">
                                                <button className="nav-link" onClick={handleFetchCourseApplicationsAndClose}>My Applications</button>
                                            </LinkContainer>
                                        </li>
                                        <li className="nav-item">
                                            <img src={imgDarkLightMode} className="nav-link" alt="Dark Mode/ Light Mode"
                                                onClick={toggleDarkMode}
                                                style={{ maxWidth: '50px', height: 'auto', cursor: 'pointer', filter: `invert(${showDarkMode ? '0%' : '100%'})` }} />
                                        </li>
                                    </div>
                                ) :
                                (
                                    <div style={{ display: "inline-flex" }}>
                                        {/* <li className="nav-item">
                                            <LinkContainer to="/" id="OpenStartPageButton">
                                                <button className="nav-link" onClick={handleClose}>Start Page</button>
                                            </LinkContainer>
                                        </li> */}
                                        <li className="nav-item">
                                            <img src={imgDarkLightMode} className="nav-link" alt="Dark Mode/ Light Mode"
                                                onClick={toggleDarkMode}
                                                style={{ maxWidth: '50px', height: 'auto', cursor: 'pointer', filter: `invert(${showDarkMode ? '0%' : '100%'})` }} />
                                        </li>
                                    </div>
                                )
                        }
                    </ul>
                </div>
            </div >
        </nav >
    );
}

export default TopMenu;

// <Navbar expand="lg" className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
//     <Container fluid>
//         <Link to="/" className="navbar-brand ml-auto">Studienbewerber-Portal</Link>
//         <LoginButton />
//         <div id="nav-buttons">
//             {isAdmin ?
//                 (
//                     <div>
//                         <LinkContainer className='nav' to="/userManagement" id="OpenUserManagementPageButton">
//                             <Button onClick={handleFetchUsersAndClose}>OpenUserManagement</Button>
//                         </LinkContainer>
//                     </div>
//                 ) : null
//             }
//             {isLoggedIn ?
//                 (
//                     <div>
//                         <LinkContainer className='nav' to="/degreeCourseManagement" id="OpenDegreeCourseManagementPageButton">
//                             <Button onClick={handleFetchDegreeCoursesAndClose}>OpenDegreeCourseManagement</Button>
//                         </LinkContainer>

//                         <LinkContainer className='nav' to="/courseApplicationManagement" id="OpenDegreeCourseApplicationManagementPageButton">
//                             <Button onClick={handleFetchCourseApplicationsAndClose}>OpenCourseApplicationManagement</Button>
//                         </LinkContainer>
//                     </div>
//                 ) : null
//             }
//             {user ?
//                 (
//                     <div>
//                         <LinkContainer className='nav' hidden={!user} to="/" id="OpenStartPageButton">
//                             <Button onClick={handleClose}>OpenStartPage</Button>
//                         </LinkContainer>
//                     </div>
//                 ) : null
//             }
//         </div>
//         <Navbar.Toggle aria-controls="navbarScroll" />
//         <Navbar.Collapse id="navbarScroll">
//             <Form className="d-flex">
//                 <Form.Control
//                     type="search"
//                     placeholder="Search"
//                     className="me-2"
//                     aria-label="Search"
//                 />
//                 <Button variant="outline-success">Search</Button>
//             </Form>
//         </Navbar.Collapse>
//     </Container>
// </Navbar>