import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showPassword: false,
  loggedOut: true,
  email: '',
  username: '',
  password: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
    setLoggedOut: (state, action) => {
      state.loggedOut = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
  },
});

export const { toggleShowPassword, setLoggedOut, setEmail, setUsername, setPassword } = appSlice.actions;
export default appSlice.reducer;
