import './App.css';
import './react/NavComponents/TopMenu';
import LandingPage from './react/MainPageComponents/LandingPage';
import StartPage from './react/MainPageComponents/StartPage';
import { Routes, Route } from "react-router-dom";
import UserManagementPage from './react/UserComponents/UserManagementPage';
import DegreeCourseManagementPage from "./react/DegreeCourseComponents/DegreeCourseManagementPage";
import CourseApplicationManagementPage from './react/CourseApplicationComponents/CourseApplicationManagementPage';
import { useSelector } from 'react-redux';

function App() {

  const userLoggedIn = useSelector((state) => state.login.isLoggedIn);
  const user = useSelector((state) => state.login.user);
  let isAdmin = false;

  if (user) {
    isAdmin = user.isAdministrator;
  }

  // we have 3 different type of users that visit the page:
  // - user, admin, guest
  // each of them need their own routes 
  return (
    <div className='App'>
      {
        // admin
        userLoggedIn && isAdmin ?
          (
            <Routes>
              <Route path='/' element={<StartPage />} />
              <Route path='/userManagement' element={<UserManagementPage />} />
              <Route path='/degreeCourseManagement' element={<DegreeCourseManagementPage />} />
              <Route path='/courseApplicationManagement' element={<CourseApplicationManagementPage />} />
              <Route path="*" element={<p>There's nothing here: 404!</p>} />
            </Routes>
          ) :
          // user
          userLoggedIn ?
            (
              < Routes >
                <Route path='/' element={<StartPage />} />
                <Route path='/degreeCourseManagement' element={<DegreeCourseManagementPage />} />
                <Route path='/courseApplicationManagement' element={<CourseApplicationManagementPage />} />
                <Route path="*" element={<p>There's nothing here: 404!</p>} />
              </Routes >
            ) :
            // guest
            (
              < Routes >
                <Route path='/' element={<LandingPage />} />
                <Route path="*" element={<p>There's nothing here: 404!</p>} />
              </Routes >
            )
      }
    </div >

  );
}

export default App;
