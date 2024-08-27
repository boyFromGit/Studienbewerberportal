import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    users: null,
    fetchPending: false,
    error: null,
};

// Async thunk for fetching all users
export const fetchAllUsers = createAsyncThunk(
    'userManagement/fetchAllUsers',
    async ({ accessToken }) => {
        try {
            console.log('userManagement: fetchAllUsers');
            return await fetchAll(accessToken);
        } catch (error) {
            console.error('fetchAll: ', error);
            throw error;
        }
    }
);

// Async thunk for creating a user
export const createUser = createAsyncThunk(
    'userManagement/createUser',
    async ({ accessToken, userData }) => {
        try {
            console.log('userManagement: createUser');
            return await create(accessToken, userData);
        } catch (error) {
            console.error('createUser: ', error);
            throw error;
        }
    }
);

// Async thunk for editing a user
export const editUser = createAsyncThunk(
    'userManagement/editUser',
    async ({ accessToken, userData }) => {
        try {
            console.log('userManagement: editUser');
            return await edit(accessToken, userData);
        } catch (error) {
            console.error('editUser: ', error);
            throw error;
        }
    }
);

// Async thunk for deleting a user
export const deleteUser = createAsyncThunk(
    'userManagement/deleteUser',
    async ({ accessToken, userID }) => {
        try {
            console.log('userManagement: deleteUser');
            return await delete_(accessToken, userID);
        } catch (error) {
            console.error('deleteUser: ', error);
            throw error;
        }
    }
);

const userManagementSlice = createSlice({
    name: 'userManagement',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                state.users = action.payload.users;
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(createUser.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                state.users.push(action.payload.data);
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(editUser.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                state.users = state.users.map(user => {
                    let data = action.payload.data
                    if (user.userID === data.userID) {
                        return {
                            ...user,
                            ...data
                        };
                    }
                    return user;
                })
                state.fetchPending = false;
                state.error = null;
            })
            .addCase(editUser.rejected, (state, action) => {
                console.log("Status rejected")
                state.fetchPending = false;
                state.error = action.error;
            })
            .addCase(deleteUser.pending, (state) => {
                console.log("Status pending")
                state.fetchPending = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                console.log("Status fulfilled");
                let deletedUserID = action.payload.userID;
                state.users = state.users.filter(user => user.userID !== deletedUserID);
                state.fetchPending = false;
                state.error = null;
            })
            
            .addCase(deleteUser.rejected, (state, action) => {
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

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/users`, requestOptions);
        const data = await response.json();

        //console.log("FetchAll response: " + JSON.stringify(data));

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        return {
            users: data,
        };
    } catch (error) {
        console.error('fetchAll: ', error);
        throw error;
    }
}

async function create(accessToken, userData) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                userID: userData.userID,
                firstName: userData.firstName,
                lastName: userData.lastName,
                isAdministrator: userData.isAdministrator,
                password: userData.password
            })
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/users`, requestOptions);
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
        console.error('createUser: ', error);
        throw error;
    }
}

async function edit(accessToken, userData) {
    try {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                userID: userData.userID,
                firstName: userData.firstName,
                lastName: userData.lastName,
                isAdministrator: userData.isAdministrator,
                password: userData.password
            })
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/users/${userData.userID}`, requestOptions);
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
        console.error('editUser: ', error);
        throw error;
    }
}

async function delete_(accessToken, userID) {
    try {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/users/${userID}`, requestOptions);
        const data = response;

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        return {
            userID
        }

    } catch (error) {
        console.error('deleteUser: ', error);
        throw error;
    }
}

export const {
    fetchAllUsersPending,
    fetchAllUsersSuccess,
    fetchAllUsersError,
    createUserPending,
    createUserSuccess,
    createUserError,
    editUserPending,
    editUserSuccess,
    editUserError,
    deleteUserPending,
    deleteUserSuccess,
    deleteUserError,
} = userManagementSlice.actions;


export default userManagementSlice.reducer;