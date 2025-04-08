import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: false, // just a flag to indicate the user is authenticated
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = true; // token is stored in HttpOnly cookie; just marking user as logged in
      state.user = action.payload.user; // comes from backend response
    },
    logout: (state) => {
      state.token = false;
      state.user = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
