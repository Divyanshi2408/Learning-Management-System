import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch Admin Stats
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://learning-management-system-o8nu.onrender.com/api/admin/stats", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

// ✅ Ban User
export const banUser = createAsyncThunk(
  "admin/banUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.put(`https://learning-management-system-o8nu.onrender.com/api/admin/ban/${userId}`, {}, { withCredentials: true });
      return userId; // Return only the ID to update state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to ban user");
    }
  }
);

// ✅ Unban User
export const unbanUser = createAsyncThunk(
  "admin/unbanUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.put(`https://learning-management-system-o8nu.onrender.com/api/admin/unban/${userId}`, {}, { withCredentials: true }); // ✅ No body needed
      return userId; // ✅ Return userId to update Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to unban user");
    }
  }
);


const adminSlice = createSlice({
  name: "admin",
  initialState: {
    totalUsers: 0,
    totalCourses: 0,
    totalExams: 0,
    bannedUsers: [], // ✅ New state to track banned users
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // ✅ Fetch Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUsers = action.payload.totalUsers;
        state.totalCourses = action.payload.totalCourses;
        state.totalExams = action.payload.totalExams;
        state.bannedUsers = action.payload.bannedUsers || []; // ✅ Load banned users if provided
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Ban User (Update State Immediately)
      .addCase(banUser.fulfilled, (state, action) => {
        if (!state.bannedUsers.includes(action.payload)) {
          state.bannedUsers.push(action.payload); // ✅ Add to banned list
        }
      })
      .addCase(banUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Unban User (Update State Immediately)
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.bannedUsers = state.bannedUsers.filter((id) => id !== action.payload); // ✅ Remove from banned list
      })
      .addCase(unbanUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
