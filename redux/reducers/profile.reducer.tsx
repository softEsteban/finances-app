import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profiles: [],
};

export const profileReducer = createSlice({
    name: "Profile reducers",
    initialState,
    reducers: {
        setProfiles: (state, action) => {
            state.profiles = action.payload;
        },
        addProfile: (state, action) => {
            state.profiles = state.profiles.concat(action.payload);
        },
        deleteProfile: (state, action) => {
            state.profiles = state.profiles.filter(
                (item: any) => item._id !== action.payload
            );
        },
    },
});

export const { setProfiles, deleteProfile, addProfile } =
    profileReducer.actions;
export default profileReducer.reducer;
