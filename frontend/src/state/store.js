import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../reducer/LoginSlice';
import UserManagementReducer from '../reducer/UserManagementSlice';
import DegreeCourseManagementReducer from '../reducer/DegreeCourseManagementSlice';
import CourseApplicationManagementReducer from '../reducer/CourseApplicationManagementSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    userManagement: UserManagementReducer,
    degreeCourseManagement: DegreeCourseManagementReducer,
    courseApplicationManagement: CourseApplicationManagementReducer
  },
})