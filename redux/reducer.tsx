import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    client: 
    {
        sessionUser: {},
        menuUser: {},
        tokenUser: "",
        selectedComponent: ""
    }
}

export const ReducerSlice = createSlice({
    name: "finances-app",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.client.sessionUser = action.payload || {};
        },
        setMenu: (state, action) => {
            state.client.menuUser = action.payload || {};
        },
        setToken: (state, action) => {
            state.client.tokenUser = action.payload || "";
        },
        setSelectedComponent: (state, action) => {
            state.client.selectedComponent = action.payload || "";
        },
    }
})

export const { setUser, setMenu, setToken, setSelectedComponent } = ReducerSlice.actions;

export default ReducerSlice.reducer;
