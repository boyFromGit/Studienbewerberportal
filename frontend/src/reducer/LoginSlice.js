import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    accessToken: null,
    isLoggedIn: false,
    loginPending: false,
    showDarkMode: false,
    showLoginDialog: false,
    error: null,
    lastUser: null, // Lernerfolgskontrolle (Zeige letzten User an mit Datum)
};

// Async thunk for authentication
export const authenticateUser = createAsyncThunk(
    'login/authenticateUser',
    async ({ userID, password }) => {
        try {
            console.log('login: authenticateUser');
            return await login(userID, password);
        } catch (error) {
            console.error('AuthenticateUser: ', error);
            throw error;
        }
    }
);

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        handleShowLightMode: (state) => {
            console.log("handle show light mode")
            state.showDarkMode = false;
        },
        handleShowDarkMode: (state) => {
            console.log("handle show dark mode")
            state.showDarkMode = true;
        },
        handleShow: (state) => {
            console.log("handle show")
            state.showLoginDialog = true;
        },
        handleClose: (state) => {
            console.log("handle close")
            state.showLoginDialog = false;
        },
        handleChange: (state, action) => {
            console.log("handle change")
            const { name, value } = action.payload;
            state[name] = value.trim();
        },
        handleLogout: (state) => {
            console.log("handle logout")
            const date = new Date();    // Lernerfolgskontrolle
            state.lastUser = { user: state.user, date: date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + ' at ' + date.getHours() + ':' + date.getMinutes() };
            state.user = null;
            state.accessToken = null;
            state.isLoggedIn = false;
            state.showLoginDialog = false;
            state.userID = undefined;
            state.password = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(authenticateUser.pending, (state) => {
                console.log("Status pending")
                state.loginPending = true;
                state.error = null;
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                console.log("Status fulfilled")
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.loginPending = false;
                state.error = null;
                state.showLoginDialog = false;
                state.isLoggedIn = true;
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                console.log("Status rejected")
                state.error = action.error;
                state.loginPending = false;
            });
    },
});

async function login(userID, password) {
    try {
        const base64Credentials = btoa(`${userID}:${password}`);
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${base64Credentials}`
            }
        };

        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/authenticate`, requestOptions);
        const data = await response.json();

        //console.log("Authentication response: " + JSON.stringify(data));

        if (!response.ok) {
            const error = data.message ? { name: data.name, message: data.message } : response.statusText;
            return Promise.reject(error);
        }

        const authorizationHeader = response.headers.get('Authorization');
        const token = authorizationHeader ? authorizationHeader.split(" ")[1] : null;

        //console.log("Token: " + token);

        return {
            user: data,
            accessToken: token
        };
    } catch (error) {
        console.error('login: ', error);
        throw error;
    }
}

export const {
    handleShow,
    handleClose,
    handleChange,
    handleLogout,
    handleShowDarkMode,
    handleShowLightMode,
    authenticationPending,
    authenticationSuccess,
    authenticationError,
} = loginSlice.actions;


export default loginSlice.reducer;