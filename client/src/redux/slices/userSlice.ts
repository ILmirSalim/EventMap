import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { PayloadAction } from "@reduxjs/toolkit";
import { IUserProfile, UserProfile } from "./interfaces/IUserProfile";
import { AuthResponse } from "./interfaces/IAuthResponce";
import { IMessage } from "./interfaces/IMessage";
import { AuthState } from "./interfaces/IAuthState";
import { apiServer } from "../../constants";

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  error: null,
  messages: [],
  privateMessages: [],
  notifications: [],
};

export const login = createAsyncThunk<AuthResponse, UserProfile>(
  "auth/login",
  async (userData) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${apiServer}/login`,
        userData
      );
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data.error);
    }
  }
);

export const getUser = createAsyncThunk<AuthResponse, string>(
  "auth/getUser",
  async (email: string) => {
    try {
      const response = await axios.get<AuthResponse>(`${apiServer}/getUser`, {
        params: {
          email: email,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data.error);
    }
  }
);

export const deleteUser = createAsyncThunk<AuthResponse, IUserProfile>(
  "auth/delete",
  async (email) => {
    try {
      const response = await axios.delete<AuthResponse>(
        `${apiServer}/deleteUser`,
        { data: { email } }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data.error);
    }
  }
);

export const addUserInEvent = createAsyncThunk<
  void,
  { eventId: string; userId: string | undefined; userName: string }
>("auth/addUserToEvent", async ({ eventId, userId, userName }) => {
  try {
    await axios.post(`${apiServer}/addUserToEvent`, {
      eventId,
      userId,
      userName,
    });
  } catch (error) {
    console.log(error);
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  {
    email: string;
    password: string;
    userName: string;
    userAge: number;
    interestsAndPreferences: string[];
    
  }
>(
  "auth/register",
  async ({
    email,
    password,
    userName,
    userAge,
    interestsAndPreferences,
    
  }) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${apiServer}/registration`,
        {
          email,
          password,
          userName,
          userAge,
          interestsAndPreferences,
          
        }
      );
      localStorage.setItem("token", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data.error);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
    hasUser: (state) => {
      state.isAuthenticated = true;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
    addPrivateMessage: (state, action: PayloadAction<IMessage>) => {
      state.privateMessages.push(action.payload);
    },
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
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.error.message || "";
      })
      .addCase(register.pending, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.refreshToken;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.error.message || "";
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled.type, (state, action) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(getUser.pending, (state, action) => {
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const { logout, hasUser, addMessage, addPrivateMessage } =
  authSlice.actions;

export default authSlice.reducer;
