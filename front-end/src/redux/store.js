import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice"; 
import courseReducer from "./courseSlice"; 
import examReducer from "./examSlice";
import adminReducer from "./adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    courses: courseReducer,
    exam: examReducer,
    admin: adminReducer,
  },
});

export default store;
