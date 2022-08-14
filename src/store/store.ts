import { configureStore } from "@reduxjs/toolkit";
import arcgisReducer from "../features/arcgis/arcgisSlice";
import countReducer from "../features/count/countSlice";
import filterReducer from "../features/filter/filterSlice";
import layoutReducer from "../features/layout/layoutSlice";

const store = configureStore({
  reducer: {
    count: countReducer,
    arcgis: arcgisReducer,
    filter: filterReducer,
    layout: layoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
