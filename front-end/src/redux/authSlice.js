import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";


// API Base URL
const API_URL = "https://learning-management-system-o8nu.onrender.com/api/auth";

// ✅ Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      const { token, user } = response.data;

      // ✅ Store in cookies
      Cookies.set("token", token, { expires: 7, secure: true });
      Cookies.set("user", JSON.stringify(user), { expires: 7, secure: true });

      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// ✅ Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      const { token, user } = response.data;

      Cookies.set("token", token, { expires: 7, secure: true });
      Cookies.set("user", JSON.stringify(user), { expires: 7, secure: true });

      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// ✅ Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {

  Cookies.remove("token");
  Cookies.remove("user");

  return null; // Reset auth state
});
// ✅ Change Password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const response = await axios.post(`${API_URL}/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Auth Slice
const storedUser = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
const storedToken = Cookies.get("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: storedToken,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetAuthState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })      
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.success = false;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });      
  },
});


export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
