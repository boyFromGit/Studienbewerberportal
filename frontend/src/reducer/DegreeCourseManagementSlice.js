import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    degreeCourses: null,
    fetchPending: false,
    error: null,
};

// Async thunk for fetching all degreeCourses
export const fetchAllDegreeCourses = createAsyncThunk(
    'degreeCourseManagement/fetchAllDegreeCourses',
    async ({ accessToken }) => {
        try {
            console.log('degreeCourseManagement: fetchAllDegreeCourses');
            return await fetchAll(accessToken);
        } catch (error) {
            console.error('fetchAll: ', error);
            throw error;
        }
    }
);

// Async thunk for creating a degreeCourse
export const createDegreeCourse = createAsyncThunk(
    'degreeCourseManagement/createDegreeCourse',
    async ({ accessToken, degreeCourseData }) => {
        try {
            console.log('degreeCourseManagement: createDegreeCourse');
            return await create(accessToken, degreeCourseData);
        } catch (error) {
            console.error('createDegreeCourse: ', error);
            throw error;
        }
    }
);

// Async thunk for editing a degreeCourse
export const editDegreeCourse = createAsyncThunk(
    'degreeCourseManagement/editDegreeCourse',
    async ({ accessToken, degreeCourseData }) => {
        try {
            console.log('degreeCourseManagement: editDegreeCourse');
            console.log(degreeCourseData)
            return await edit(accessToken, degreeCourseData);
        } catch (error) {
            console.error('editDegreeCourse: ', error);
            throw error;
        }
    }
);

// Async thunk for deleting a degreeCourse
export const deleteDegreeCourse = createAsyncThunk(
    'degreeCourseManagement/deleteDegreeCourse',
    async ({ accessToken, id }) => {
        try {
            console.log('degreeCourseManagement: deleteDegreeCourse');
            return await delete_(accessToken, id);
        } catch (error) {
            console.error('deleteDegreeCourse: ', error);
            throw error;
        }
    }
);

const degreeCourseManagementSlice = createSlice({
    name: 'degreeCourseManagement',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllDegreeCourses.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(fetchAllDegreeCourses.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                state.degreeCourses = action.payload.degreeCourses;
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(fetchAllDegreeCourses.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(createDegreeCourse.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(createDegreeCourse.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                state.degreeCourses.push(action.payload.data);
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(createDegreeCourse.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(editDegreeCourse.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(editDegreeCourse.fulfilled, (state, action) => {
                console.log("Status fulfilled");
                state.degreeCourses = state.degreeCourses.map(degreeCourse => {
                    let data = action.payload.data;
                    if (degreeCourse.id === data.id) {
                        return {
                            ...degreeCourse,
                            ...data
                        };
                    }
                    return degreeCourse;
                })
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(editDegreeCourse.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(deleteDegreeCourse.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(deleteDegreeCourse.fulfilled, (state, action) => {
                console.log("Status fulfilled");
                let deletedDegreeCourseID = action.payload.id;
                state.degreeCourses = state.degreeCourses.filter(degreeCourse => degreeCourse.id !== deletedDegreeCourseID);
                state.fetchPending = false;
                state.error = null;

            })
            .addCase(deleteDegreeCourse.rejected, (state, action) => {
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

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/degreeCourses`, requestOptions);
        const data = await response.json();

        console.log("FetchAll response: " + JSON.stringify(data));

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        return {
            degreeCourses: data
        };
    } catch (error) {
        console.error('fetchAll: ', error);
        throw error;
    }
}

async function create(accessToken, degreeCourseData) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name: degreeCourseData.name,
                shortName: degreeCourseData.shortName,
                universityName: degreeCourseData.universityName,
                universityShortName: degreeCourseData.universityShortName,
                departmentName: degreeCourseData.departmentName,
                departmentShortName: degreeCourseData.departmentShortName
            })
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/degreeCourses`, requestOptions);
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
        console.error('createDegreeCourse: ', error);
        throw error;
    }
}

async function edit(accessToken, degreeCourseData) {
    try {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name: degreeCourseData.name,
                shortName: degreeCourseData.shortName,
                universityName: degreeCourseData.universityName,
                universityShortName: degreeCourseData.universityShortName,
                departmentName: degreeCourseData.departmentName,
                departmentShortName: degreeCourseData.departmentShortName
            })
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/degreeCourses/${degreeCourseData.id}`, requestOptions);
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
        console.error('editDegreeCourse: ', error);
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

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/degreeCourses/${id}`, requestOptions);
        const data = response;

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        return {
            id
        }

    } catch (error) {
        console.error('deleteDegreeCourse: ', error);
        throw error;
    }
}

export const {
    fetchAllDegreeCoursesPending,
    fetchAllDegreeCoursesSuccess,
    fetchAllDegreeCoursesError,
    createDegreeCoursePending,
    createDegreeCourseSuccess,
    createDegreeCourseError,
    editDegreeCoursePending,
    editDegreeCourseSuccess,
    editDegreeCourseError,
    deleteDegreeCoursePending,
    deleteDegreeCourseSuccess,
    deleteDegreeCourseError,
} = degreeCourseManagementSlice.actions;


export default degreeCourseManagementSlice.reducer;