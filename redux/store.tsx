import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./reducer";
import ProfileReducer from "./reducers/profile.reducer";

export const store = configureStore({
  reducer: {
    app: Reducer,
    profile: ProfileReducer,
  },
});
