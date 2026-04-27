import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, value) => {
            state.token = value.payload;
            localStorage.setItem("token", value.payload); 
        },
        removeToken: (state) => {
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("userData"); 
        },
    },
});

export const { setToken, removeToken } = authSlice.actions;
export default authSlice.reducer;