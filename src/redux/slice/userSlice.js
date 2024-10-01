import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, postUser } from "../../api/api";

// Load user from localStorage
const loadUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  if (user && token) {
    return { user: JSON.parse(user), token };
  }
  return { user: null, token: null };
};

const initialState = {
  ...loadUserFromLocalStorage(),
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("orderStatusCounts");
      localStorage.removeItem("orderDetail");
      localStorage.removeItem("formData");
    },
  },
});

export const { setUser, setError, clearError, logout } = userSlice.actions;

// Thunk to initialize user from localStorage
export const initializeUser = () => (dispatch) => {
  const { user, token } = loadUserFromLocalStorage();
  if (user && token) {
    dispatch(setUser({ user, token }));
  }
};

// Add the selectUser selector
export const selectUser = (state) => state.user.user;

export const loginUserAsync = (credentials) => async (dispatch) => {
  try {
    const user = await loginUser(credentials);
    dispatch(setUser({ user, token: user.token }));
    dispatch(clearError());
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};

// Fix for postUserAsync (using createAsyncThunk)
export const postUserAsync = createAsyncThunk(
  'user/signup',  // Unique action identifier
  async (userData, { rejectWithValue }) => {
    try {
      const response = await postUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export default userSlice.reducer;
