import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "../features/filter/filterSlice";
import layoutReducer from "../features/layout/layoutSlice";

const store = configureStore({
  reducer: {
    filter: filterReducer,
    layout: layoutReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
