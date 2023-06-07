import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserProfile {
    email: string;
    id?: string;
  password: string;
  userName: string;
  userAge: string;
  interestsAndPreferences: string;
  avatar?: File | undefined
  }

  interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
  }

  export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    user: UserProfile | null; 
    error: string | null;
  }
  
  const initialState: AuthState = {
    isAuthenticated: false,
    token: null,
    user: null,
    error: null,
  };
  
// функция для отправки запроса на сервер для авторизации
export const login = createAsyncThunk<AuthResponse, UserProfile>(
    'auth/login',
    async (userData) => {
        try {
            const response = await axios.post<AuthResponse>(
              'http://localhost:3002/api/login',
              userData
            );
            localStorage.setItem('token', response.data.accessToken);
            return response.data;
          } catch (error: any) { // явно указываем тип ошибки как "any"
            throw new Error(error.response?.data.error);
          }
    }
  );

  export const register = createAsyncThunk<AuthResponse,  {
    email: string;
    password: string;
    userName: string;
    userAge: number;
    interestsAndPreferences: string;
    avatar: File | undefined
  }>(
    'auth/register',
    async ({
      email,
      password,
      userName,
      userAge,
      interestsAndPreferences,
      avatar
    }) => {
      try {
        const response = await axios.post<AuthResponse>('http://localhost:3002/api/registration', {
          email,
          password,
          userName,
          userAge,
          interestsAndPreferences,
          avatar
        });
        localStorage.setItem('token', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      } catch (error:any) {
        throw new Error(error.response?.data.error);
      }
    }
  );
  // export const register = createAsyncThunk<AuthResponse, {
  //   email: string;
  //   password: string;
  //   userName: string;
  //   userAge: number;
  //   interestsAndPreferences: string;
  //   avatar: File | undefined
  // }>(
  //   'auth/register',
  //   async ({
  //     email,
  //     password,
  //     userName,
  //     userAge,
  //     interestsAndPreferences,
  //     avatar
  //   }) => {
  //     try {
  //       const response = await axios.post<AuthResponse>(
  //         'http://localhost:3002/api/registration',
  //         email,
  //     password,
  //     userName,
  //     userAge,
  //     interestsAndPreferences,
  //     avatar
  //       );
  //       localStorage.setItem('token', response.data.refreshToken);
  //       localStorage.setItem('user', JSON.stringify(response.data.user));
  //       return response.data;
  //     } catch (error:any) {
  //       console.log(error);
        
  //       // if (error.response) {
  //       //   return rejectWithValue(error.response.data);
  //       // }
  //       // return rejectWithValue({ error: error.message });
        
  //     }
  //   }
  // );

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
    hasUser: (state) => {
        state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(login.pending, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.refreshToken;
        // добавляем данные профиля в стейт
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.error.message || '';
      })
      .addCase(register.pending, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.refreshToken;
        // добавляем данные профиля в стейт
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.error.message || '';
      });
  },
});

export const { logout, hasUser } = authSlice.actions;

export default authSlice.reducer;
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { authAPI } from '../Api/authAPI';

// interface IUser {
//     email: string;
//     password: string;
//     userName: string;
//     userAge: string;
//     interestsAndPreferences: string;
// }
// export const register = createAsyncThunk(
//     'auth/register',
//     async ({
//         email,
//         password,
//         userName,
//         userAge,
//         interestsAndPreferences,
//     }: IUser) => {
//         try {
//             const response = await axios.post('http://localhost:3002/api/registration', {
//                 email,
//                 password,
//                 userName,
//                 userAge,
//                 interestsAndPreferences,
//             });
//             localStorage.setItem('token', response.data.refreshToken);
//             return response.data;
//         } catch (error) {
//             console.log(error);

//         }
//     }
// );
// interface LoginResponse {
//     accessToken: string;
//     refreshToken: string;
//     user: {
//         email: string;
//         id: string;
//     };
// }

// export const login = createAsyncThunk<LoginResponse, { email: string, password: string }>(
//     'auth/login',
//     async ({ email, password }) => {
//         const response = await authAPI.authUser(email, password);
//         return response;
//     }
// );
// export const login = createAsyncThunk(
//     'auth/login',
//     async ({ email, password }: { email: string, password: string }) => {
//       return await authAPI.authUser(email, password)
//     }
//   );

// const initialState = {
//     loading: false,
//     isAuthenticated: false,
//     user: {},

// }

// export const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(login.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(login.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.isAuthenticated = true;
//                 state.user = action.payload.user;
//                 localStorage.setItem('token', action.payload.refreshToken);
//             })

          

//     },
// });

// // Define selector
// export { }

// export default authSlice.reducer;