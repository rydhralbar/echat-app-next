import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
  token: null,
  isLogin: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, payload) => {
      state.profile = payload;
    },
    setIsLogin: (state, payload) => {
      state.isLogin = payload;
    },
  },
});

export const { setProfile, setIsLogin } = profileSlice.actions;

export default profileSlice.reducer;
