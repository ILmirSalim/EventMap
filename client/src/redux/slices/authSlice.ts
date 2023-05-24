import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { authAPI } from '../Api/authAPI';

interface IUser {
    email: string;
    password: string;
    userName: string;
    userAge: string;
    interestsAndPreferences: string;
}
export const register = createAsyncThunk(
    'auth/register',
    async ({
        email,
        password,
        userName,
        userAge,
        interestsAndPreferences,
    }: IUser) => {
        try {
            const response = await axios.post('http://localhost:3002/api/registration', {
                email,
                password,
                userName,
                userAge,
                interestsAndPreferences,
            });
            localStorage.setItem('token', response.data.refreshToken);
            return response.data;
        } catch (error) {
            console.log(error);

        }
    }
);
interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        email: string;
        id: string;
    };
}

export const login = createAsyncThunk<LoginResponse, { email: string, password: string }>(
    'auth/login',
    async ({ email, password }) => {
        const response = await authAPI.authUser(email, password);
        return response;
    }
);
// export const login = createAsyncThunk(
//     'auth/login',
//     async ({ email, password }: { email: string, password: string }) => {
//       return await authAPI.authUser(email, password)
//     }
//   );

const initialState = {
    loading: false,
    isAuthenticated: false,
    user: {},

}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                localStorage.setItem('token', action.payload.refreshToken);
            })

          

    },
});

// Define selector
export { }

export default authSlice.reducer;