import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Base API URL
const API_URL = "https://learning-management-system-o8nu.onrender.com/api/users";

// ✅ Fetch all users (Admin only)
export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token"); 
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users.");
    }
  }
);

// ✅ Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (_id, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.get(`${API_URL}/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        ...response.data,
        isBanned: response.data.isBanned || false, // ✅ Ensure `isBanned` exists
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user.");
    }
  }
);


// ✅ Fetch current logged-in user
export const fetchCurrentUser = createAsyncThunk(
  "users/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch current user.");
    }
  }
);

// ✅ Update user profile (Handles Profile Picture Upload)
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updates, profilePicture }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");
      if (!token) return rejectWithValue("No authentication token found.");

      let formData;
      const headers = { Authorization: `Bearer ${token}` };

      if (profilePicture) {
        // Handle file upload (multipart/form-data)
        formData = new FormData();
        for (const key in updates) {
          formData.append(key, updates[key]);
        }
        formData.append("profilePicture", profilePicture); // Attach the file

        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axios.put(
        `${API_URL}/${id}`,
        profilePicture ? formData : updates, // Use formData for file upload, JSON otherwise
        { headers }
      );

      return response.data.user; // Return updated user data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user.");
    }
  }
);

// ✅ Redux Slice
const storedUser = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
const storedToken = Cookies.get("token") || null;

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    user: null,
    currentUser: storedUser, // ✅ Use stored user from cookies
    token: storedToken, // ✅ Use stored token from cookies
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; // ✅ Update current user data
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default userSlice.reducer;
