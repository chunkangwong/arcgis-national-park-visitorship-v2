import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tempDrawerOpen: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setTempDrawerOpen(state, action) {
      state.tempDrawerOpen = action.payload;
    },
  },
});

export const { setTempDrawerOpen } = layoutSlice.actions;

export default layoutSlice.reducer;
