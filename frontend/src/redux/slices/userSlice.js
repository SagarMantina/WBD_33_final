import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Initial state
const initialState = {
  user: null, // User data
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${backendUrl}/userdata`, {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
          "x-username": localStorage.getItem("username"), // Send username from localStorage
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.errorMessage || "Failed to fetch user data");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue("Internal server error");
    }
  }
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export reducer
export default userSlice.reducer;
