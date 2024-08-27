import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    courseApplications: null,
    fetchPending: false,
    error: null,
};

// Async thunk for fetching all courseApplications
// this method is for admins
export const fetchAllCourseApplications = createAsyncThunk(
    'courseApplicationManagement/fetchAllCourseApplications',
    async ({ accessToken }) => {
        try {
            console.log('courseApplicationManagement: fetchAllCourseApplications');
            return await fetchAll(accessToken);
        } catch (error) {
            console.error('fetchAll: ', error);
            throw error;
        }
    }
);

// Async thunk for fetching all courseApplications
// this method is for users
export const fetchMyCourseApplications = createAsyncThunk(
    'courseApplicationManagement/fetchMyCourseApplications',
    async ({ accessToken }) => {
        try {
            console.log('courseApplicationManagement: fetchMyCourseApplications');
            return await fetchMy(accessToken);
        } catch (error) {
            console.error('fetchMy: ', error);
            throw error;
        }
    }
);

// Async thunk for creating a courseApplication
export const createCourseApplication = createAsyncThunk(
    'courseApplicationManagement/createCourseApplication',
    async ({ accessToken, courseApplicationData }) => {
        try {
            console.log('courseApplicationManagement: createCourseApplication');
            return await create(accessToken, courseApplicationData);
        } catch (error) {
            console.error('createCourseApplication: ', error);
            throw error;
        }
    }
);

// Async thunk for editing a courseApplication
export const editCourseApplication = createAsyncThunk(
    'courseApplicationManagement/editCourseApplication',
    async ({ accessToken, courseApplicationData }) => {
        try {
            console.log('courseApplicationManagement: editCourseApplication');
            return await edit(accessToken, courseApplicationData);
        } catch (error) {
            console.error('editCourseApplication: ', error);
            throw error;
        }
    }
);

// Async thunk for deleting a courseApplication
export const deleteCourseApplication = createAsyncThunk(
    'courseApplicationManagement/deleteCourseApplication',
    async ({ accessToken, id }) => {
        try {
            console.log('courseApplicationManagement: deleteCourseApplication');
            return await delete_(accessToken, id);
        } catch (error) {
            console.error('deleteCourseApplication: ', error);
            throw error;
        }
    }
);

const courseApplicationManagementSlice = createSlice({
    name: 'courseApplicationManagement',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCourseApplications.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(fetchAllCourseApplications.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                state.courseApplications = action.payload.courseApplications;
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(fetchAllCourseApplications.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(fetchMyCourseApplications.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(fetchMyCourseApplications.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                state.courseApplications = action.payload.courseApplications;
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(fetchMyCourseApplications.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(createCourseApplication.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(createCourseApplication.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                if (!state.courseApplications) {
                    // just add the one application if they didnt got fetched before
                    // thats needed only here because it could be that we first visit the create page without having to fetch the applications once
                    state.courseApplications = action.payload.data;
                } else {
                    state.courseApplications.push(action.payload.data);
                }
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(createCourseApplication.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(editCourseApplication.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(editCourseApplication.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                state.courseApplications = state.courseApplications.map(courseApplication => {
                    let data = action.payload.data;
                    if (courseApplication.id === data.id) {
                        return {
                            ...courseApplication,
                            ...data
                        };
                    }
                    return courseApplication;
                })
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(editCourseApplication.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(deleteCourseApplication.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(deleteCourseApplication.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                let deletedCourseApplicationID = action.payload.id;
                state.courseApplications = state.courseApplications.filter(courseApplication => courseApplication.id !== deletedCourseApplicationID);
                state.fetchPending = false;
                state.error = null;

            })
            .addCase(deleteCourseApplication.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
    },
});

async function fetchAll(accessToken) {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/degreeCourseApplications`, requestOptions);
        const data = await response.json();

        // console.log("FetchAll response: " + JSON.stringify(data));

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        return {
            courseApplications: data
        };
    } catch (error) {
        console.error('fetchAll: ', error);
        throw error;
    }
}

async function fetchMy(accessToken) {
    try {
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/degreeCourseApplications/myApplications`, requestOptions);
        const data = await response.json();

        // console.log("FetchMy response: " + JSON.stringify(data));

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        return {
            courseApplications: data
        };
    } catch (error) {
        console.error('fetchAll: ', error);
        throw error;
    }
}

async function create(accessToken, courseApplicationData) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                applicantUserID: courseApplicationData.applicantUserID,
                degreeCourseID: courseApplicationData.degreeCourseID,
                targetPeriodYear: courseApplicationData.targetPeriodYear,
                targetPeriodShortName: courseApplicationData.targetPeriodShortName
            })
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/degreeCourseApplications`, requestOptions);
        const data = await response.json();

        //console.log("create response: " + JSON.stringify(data));

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        return {
            data
        }
    } catch (error) {
        console.error('createCourseApplication: ', error);
        throw error;
    }
}

async function edit(accessToken, courseApplicationData) {
    try {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                applicantUserID: courseApplicationData.applicantUserID,
                degreeCourseID: courseApplicationData.degreeCourseID,
                targetPeriodYear: courseApplicationData.targetPeriodYear,
                targetPeriodShortName: courseApplicationData.targetPeriodShortName
            })
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/degreeCourseApplications/${courseApplicationData.id}`, requestOptions);
        const data = await response.json();

        //console.log("create response: " + JSON.stringify(data));

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        return {
            data
        }
    } catch (error) {
        console.error('editCourseApplication: ', error);
        throw error;
    }
}

async function delete_(accessToken, id) {
    try {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/degreeCourseApplications/${id}`, requestOptions);
        const data = response;

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        return {
            id
        }

    } catch (error) {
        console.error('deleteCourseApplication: ', error);
        throw error;
    }
}

export const {
    fetchAllCourseApplicationsPending,
    fetchAllCourseApplicationsSuccess,
    fetchAllCourseApplicationsError,
    fetchMyCourseApplicationsPending,
    fetchMyCourseApplicationsError,
    fetchMyCourseApplicationsSuccess,
    createCourseApplicationPending,
    createCourseApplicationSuccess,
    createCourseApplicationError,
    editCourseApplicationPending,
    editCourseApplicationSuccess,
    editCourseApplicationError,
    deleteCourseApplicationPending,
    deleteCourseApplicationSuccess,
    deleteCourseApplicationError,
} = courseApplicationManagementSlice.actions;

export default courseApplicationManagementSlice.reducer;